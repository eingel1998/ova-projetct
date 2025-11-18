import { Component, inject, signal, computed, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  private supabase = inject(SupabaseService);

  email = signal('');
  message = signal('');
  password = signal('');
  user = signal<any>(null);
  profile = signal<any>(null);

  isLoggedIn = computed(() => !!this.user());
  isRegistering = signal(false);
  displayName = signal('');
  showModal = signal(false);

  @Output() closeModal = new EventEmitter<void>();

  private unsub: (() => void) | null = null;

  constructor() {
    // Initialize session state
    this.initializeSession();
  }

  private async initializeSession() {
    try {
      // 1. Get initial session immediately
      const user = await this.supabase.getCurrentUser();
      if (user) {
        this.user.set(user);
        const profile = await this.supabase.getProfile(user.id);
        this.profile.set(profile);
      }

      // 2. Subscribe to changes (handles sign in, sign out, and token refreshes)
      this.subscribeAuth();
    } catch (err) {
      console.warn('Error initializing session:', err);
    }
  }

  toggleMode() {
    this.isRegistering.set(!this.isRegistering());
    this.message.set('');
    // Clear form data to prevent sharing between modes
    this.email.set('');
    this.password.set('');
    this.displayName.set('');
  }

  openModal() {
    this.showModal.set(true);
  }

  close() {
    this.showModal.set(false);
    this.closeModal.emit();
  }

  async handleSubmit() {
    this.message.set('');
    try {
      if (this.isRegistering()) {
        // Registro
        const { data, error } = await this.supabase.signUp(this.email(), this.password(), {
          display_name: this.displayName() || this.email().split('@')[0]
        });
        if (error) throw error;
        this.message.set('Registro exitoso. ' + (data.session ? 'Bienvenido!' : 'Por favor verifica tu correo.'));
        if (data.session) {
          setTimeout(() => this.close(), 1500);
        }
      } else {
        // Login
        if (this.password()) {
          const { error } = await this.supabase.signInWithPassword(this.email(), this.password());
          if (error) throw error;
          this.message.set('Sesión iniciada');
          setTimeout(() => this.close(), 1000);
        } else {
          const { error } = await this.supabase.signInWithEmail(this.email());
          if (error) throw error;
          this.message.set('Revisa tu correo para entrar.');
        }
      }
    } catch (err: any) {
      console.error('Error en auth', err);
      this.message.set(err?.message || 'Error en autenticación');
    }
  }

  async login() {
    await this.handleSubmit();
  }

  ngOnDestroy() {
    this.unsub?.();
  }

  private async subscribeAuth() {
    this.unsub = this.supabase.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;
      this.user.set(currentUser);

      if (currentUser) {
        // Refresh profile on sign in or token refresh
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
          const profile = await this.supabase.getProfile(currentUser.id);
          this.profile.set(profile);
        }
      } else {
        this.profile.set(null);
      }

      if (event === 'SIGNED_IN') this.message.set('Sesión iniciada');
      if (event === 'SIGNED_OUT') this.message.set('Sesión cerrada');
    });
  }

  async logout() {
    try {
      await this.supabase.signOut();
      // Clear all local state
      this.user.set(null);
      this.profile.set(null);
      this.email.set('');
      this.password.set('');
      this.displayName.set('');
      this.message.set('Sesión cerrada');
    } catch (err) {
      console.warn('Error en logout', err);
    }
  }
}
