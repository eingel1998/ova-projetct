import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth/auth.component';
import { SupabaseService } from './services/supabase.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, AuthComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('ova-projetct');
  protected readonly sidebarOpen = signal(false);
  protected readonly isAdmin = signal(false);
  private supabase = inject(SupabaseService);
  private unsubscribe: (() => void) | null = null;

  async ngOnInit() {
    // 1. Initial check
    const user = await this.supabase.getCurrentUser();
    await this.updateAdminStatus(user);

    // 2. Subscribe to auth changes
    this.unsubscribe = this.supabase.onAuthStateChange(async (event, session) => {
      console.log('App: Auth event', event);
      await this.updateAdminStatus(session?.user);
    });
  }

  private async updateAdminStatus(user: any) {
    if (!user) {
      this.isAdmin.set(false);
      return;
    }

    try {
      // Check profile for role
      const profile = await this.supabase.getProfile(user.id);

      const role = profile?.role;
      const isUserAdmin = role === 'admin';

      this.isAdmin.set(isUserAdmin);
    } catch (error) {
      console.error('App: Error checking admin status', error);
      this.isAdmin.set(false);
    }
  }

  ngOnDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  toggleSidebar() {
    this.sidebarOpen.set(!this.sidebarOpen());
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }
}
