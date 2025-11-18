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
      this.router.navigate(['/aprendizaje']);
      return false;
    }
    
    try {
      let user = await this.supabase.getCurrentUser();
      // If no user yet, wait shortly for the auth client to restore any persisted session
      if (!user) {
        user = await new Promise((resolve) => {
          let resolved = false;
          const unsub = this.supabase.onAuthStateChange((event, session) => {
            if (!resolved && session?.user) {
              resolved = true;
              unsub();
              resolve(session.user);
            }
          });
          // fallback timeout
          setTimeout(() => {
            if (!resolved) {
              resolved = true;
              try { unsub(); } catch (_) {}
              resolve(null);
            }
          }, 1200);
        });
      }
      console.log('AdminGuard current user:', user);
      
      if (!user) {
        console.log('AdminGuard: No user logged in');
        this.router.navigate(['/aprendizaje']);
        return false;
      }

      const profile = await this.supabase.getProfile(user.id);
      console.log('AdminGuard profile:', profile);
      
      if (profile?.role === 'admin') {
        console.log('AdminGuard: Access granted');
        return true;
      }
      
      console.log('AdminGuard: User is not admin, redirecting');
      this.router.navigate(['/aprendizaje']);
      return false;
    } catch (error) {
      console.error('AdminGuard error:', error);
      this.router.navigate(['/aprendizaje']);
      return false;
    }
  }
}
