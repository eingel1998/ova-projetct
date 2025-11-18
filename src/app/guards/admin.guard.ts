import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  private supabase = inject(SupabaseService);
  private router = inject(Router);

  async canActivate(): Promise<boolean> {
    console.log('AdminGuard.canActivate called');
    if (!this.supabase.isConfigured()) {
      console.warn('Supabase not configured — Admin routes are unavailable.');
      // If we don't have a Supabase configuration, redirect to learning
      this.router.navigate(['/aprendizaje']);
      return false;
    }
    const user = await this.supabase.getCurrentUser();
    console.log('AdminGuard current user:', user);
    if (!user) {
      this.router.navigate(['/aprendizaje']);
      return false;
    }

    const profile = await this.supabase.getProfile(user.id);
    if (profile?.role === 'admin') return true;
    console.log('AdminGuard no admin role, profile=', profile);

    // no permissions
    this.router.navigate(['/aprendizaje']);
    return false;
  }
}
