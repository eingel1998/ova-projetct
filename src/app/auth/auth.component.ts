import { Component, inject, signal, computed, OnDestroy } from '@angular/core';
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

  private unsub: (() => void) | null = null;

  constructor() {
    // load current user (if any)
    (async () => {
      try {
        const u = await this.supabase.getCurrentUser();
        this.user.set(u);
        if (u?.id) {
          const p = await this.supabase.getProfile(u.id);
          this.profile.set(p);
        }
        this.subscribeAuth();
      } catch (err) {
        console.warn('No se pudo cargar usuario', err);
      }
    })();
  }

  async login() {
    this.message.set('');
    try {
      if (this.password()) {
        await this.supabase.signInWithPassword(this.email(), this.password());
      } else {
        await this.supabase.signInWithEmail(this.email());
      }
      // refresh user
      const u = await this.supabase.getCurrentUser();
      this.user.set(u);
      if (u?.id) {
        const p = await this.supabase.getProfile(u.id);
        this.profile.set(p);
      }
      if (this.password()) this.message.set('Sesión iniciada');
      else this.message.set('Revisa tu correo para entrar (link de un solo uso).');
    } catch (err: any) {
      console.error('Error en login', err);
      this.message.set(err?.message || 'Error al iniciar sesión');
    }
  }

  ngOnDestroy() {
    this.unsub?.();
  }

  private async subscribeAuth() {
    // keep UI updated after OTP login or password login
    this.unsub = this.supabase.onAuthStateChange((event, session) => {
      this.user.set(session?.user ?? null);
      if (session?.user?.id) {
        (async () => this.profile.set(await this.supabase.getProfile(session.user.id)))();
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
      this.user.set(null);
      this.message.set('Sesión cerrada');
    } catch (err) {
      console.warn('Error en logout', err);
    }
  }
}
