import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css'
})
export class AdminPanel {
  private supabase = inject(SupabaseService);
  progreso: any[] = [];

  constructor() {
    this.load();
  }

  async load() {
    try {
      this.progreso = await this.supabase.getAllProgress();
    } catch (err) {
      console.error('No se pudo cargar progreso', err);
    }
  }
}
