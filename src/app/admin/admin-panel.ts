import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupabaseService } from '../services/supabase.service';
import { QUIZZES } from '../quiz/quiz.data';

interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  role: string;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css'
})
export class AdminPanel {
  private supabase = inject(SupabaseService);
  private fb = inject(FormBuilder);

  // Tab management
  activeTab: 'resultados' | 'usuarios' = 'resultados';

  // Resultados
  progreso: any[] = [];

  // Usuarios
  usuarios: UserProfile[] = [];
  editingUser: UserProfile | null = null;
  userForm: FormGroup;
  isCreating = false;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor() {
    this.userForm = this.fb.group({
      display_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['user', Validators.required],
      password: ['', Validators.minLength(4)] // Opcional
    });

    this.loadResultados();
  }

  // Tab switching
  setTab(tab: 'resultados' | 'usuarios') {
    this.activeTab = tab;
    if (tab === 'usuarios' && this.usuarios.length === 0) {
      this.loadUsuarios();
    }
  }

  // Resultados methods
  async loadResultados() {
    try {
      this.progreso = await this.supabase.getAllProgress();
    } catch (err) {
      console.error('No se pudo cargar progreso', err);
    }
  }

  getQuizTitle(experienciaId: string): string {
    if (experienciaId.startsWith('quiz_')) {
      const id = experienciaId.replace('quiz_', '');
      const quiz = QUIZZES.find(q => q.id === id);
      return quiz ? quiz.title : experienciaId;
    }
    return experienciaId;
  }

  // Usuarios CRUD methods
  async loadUsuarios() {
    this.loading = true;
    this.errorMessage = '';
    try {
      this.usuarios = await this.supabase.getAllUsers();
    } catch (err: any) {
      this.errorMessage = 'Error al cargar usuarios: ' + (err.message || err);
      console.error('Error loading users:', err);
    } finally {
      this.loading = false;
    }
  }

  startEdit(user: UserProfile) {
    this.editingUser = user;
    this.isCreating = false;
    this.userForm.patchValue({
      display_name: user.display_name,
      email: user.email,
      role: user.role
    });
    this.errorMessage = '';
    this.successMessage = '';
  }

  cancelEdit() {
    this.editingUser = null;
    this.isCreating = false;
    this.userForm.reset({ role: 'user' });
    this.errorMessage = '';
    this.successMessage = '';
  }

  async saveUser() {
    if (!this.userForm.valid) {
      this.errorMessage = 'Por favor completa todos los campos correctamente';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const formValue = this.userForm.value;

      if (this.editingUser) {
        // Update existing user
        const updates: any = {
          display_name: formValue.display_name,
          role: formValue.role
        };

        // Update profile (name and role)
        await this.supabase.updateUserProfile(this.editingUser.id, updates);

        // Update email if changed
        if (formValue.email !== this.editingUser.email) {
          await this.supabase.updateUserEmail(this.editingUser.id, formValue.email);
        }

        // Update password if provided
        if (formValue.password && formValue.password.trim() !== '') {
          await this.supabase.updateUserPassword(this.editingUser.id, formValue.password);
        }

        this.successMessage = 'Usuario actualizado correctamente';
      }

      // Reload users and reset form
      await this.loadUsuarios();
      this.cancelEdit();
    } catch (err: any) {
      this.errorMessage = 'Error al guardar: ' + (err.message || err);
      console.error('Error saving user:', err);
    } finally {
      this.loading = false;
    }
  }

  async deleteUser(user: UserProfile) {
    if (!confirm(`¿Estás seguro de eliminar al usuario ${user.display_name || user.email}?`)) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      await this.supabase.deleteUser(user.id);
      this.successMessage = 'Usuario eliminado correctamente';
      await this.loadUsuarios();
    } catch (err: any) {
      this.errorMessage = 'Error al eliminar: ' + (err.message || err);
      console.error('Error deleting user:', err);
    } finally {
      this.loading = false;
    }
  }
}

