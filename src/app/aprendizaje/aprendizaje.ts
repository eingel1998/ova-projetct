import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../services/supabase.service';
import { Viaje3D } from './experiencias/viaje-3d/viaje-3d';
import { LaboratorioVirtual } from './experiencias/laboratorio-virtual/laboratorio-virtual';
import { EstadisticasVivas } from './experiencias/estadisticas-vivas/estadisticas-vivas';
import { AventuraPrevencion } from './experiencias/aventura-prevencion/aventura-prevencion';

interface ExperienciaAprendizaje {
  id: string;
  titulo: string;
  descripcion: string;
  icono: string;
  disponible: boolean;
  completada: boolean;
}

@Component({
  selector: 'app-aprendizaje',
  imports: [CommonModule, Viaje3D, LaboratorioVirtual, EstadisticasVivas, AventuraPrevencion],
  templateUrl: './aprendizaje.html',
  styleUrl: './aprendizaje.css',
})
export class Aprendizaje implements OnInit {
  private supabaseService = inject(SupabaseService);
  experiencias = signal<ExperienciaAprendizaje[]>([
    {
      id: 'viaje-microscopico',
      titulo: 'Viaje Microscópico',
      descripcion: 'Explora el camino del VPH dentro del cuerpo humano',
      icono: '🔬',
      disponible: true,
      completada: false
    },
    {
      id: 'laboratorio-virtual',
      titulo: 'Laboratorio Virtual',
      descripcion: 'Investiga diferentes cepas del VPH',
      icono: '🧪',
      disponible: true,
      completada: false
    },
    {
      id: 'estadisticas-vivas',
      titulo: 'Estadísticas Vivas',
      descripcion: 'Analiza datos globales sobre el VPH',
      icono: '📊',
      disponible: true,
      completada: false
    },
    {
      id: 'aventura-prevencion',
      titulo: 'Aventura de Prevención',
      descripcion: 'Toma decisiones para prevenir el VPH',
      icono: '🛡️',
      disponible: true,
      completada: false
    }
  ]);

  experienciaActual = signal<string | null>(null);
  progresoGeneral = signal(0);

  async ngOnInit() {
    console.log('Aprendizaje ngOnInit start');
    try {
      const user = await this.supabaseService.getCurrentUser();
      console.log('Aprendizaje user', user);
      if (user?.id) {
        const progress = await this.supabaseService.getProgress(user.id);
        // map progress to experiencias
        this.experiencias.update(exps =>
          exps.map(exp => ({
            ...exp,
            completada: !!progress.find((p: any) => p.experiencia_id === exp.id && p.completada)
          }))
        );

        // calcular progreso
        const completadas = this.experiencias().filter(e => e.completada).length;
        this.progresoGeneral.set((completadas / this.experiencias().length) * 100);
      }
    } catch (err) {
      console.warn('No se pudo cargar progreso desde Supabase', err);
    }
    console.log('Aprendizaje ngOnInit end');
  }

  seleccionarExperiencia(experienciaId: string) {
    console.log('seleccionarExperiencia', experienciaId);
    const exp = this.experiencias().find(e => e.id === experienciaId);
    if (exp) {
      this.experienciaActual.set(experienciaId);
    }
  }

  volverAlMenu() {
    this.experienciaActual.set(null);
  }

  marcarCompletada(experienciaId: string) {
    this.experiencias.update(exps =>
      exps.map(exp =>
        exp.id === experienciaId
          ? { ...exp, completada: true }
          : exp
      )
    );

    // Actualizar progreso general
    const completadas = this.experiencias().filter(e => e.completada).length;
    this.progresoGeneral.set((completadas / this.experiencias().length) * 100);

    // Persistir en Supabase (si hay usuario)
    (async () => {
      try {
        const user = await this.supabaseService.getCurrentUser();
        if (user?.id) {
          await this.supabaseService.upsertProgress(user.id, experienciaId, { completada: true, updated_at: new Date().toISOString() });
        }
      } catch (err) {
        console.warn('No se pudo persistir progreso en Supabase', err);
      }
    })();
  }

  // Handlers para los componentes hijos
  onViajeMicroscopicoCompletar() {
    this.marcarCompletada('viaje-microscopico');
  }

  onViajeMicroscopicoVolver() {
    this.volverAlMenu();
  }

  // Handlers para laboratorio virtual
  onLaboratorioCompletar() {
    this.marcarCompletada('laboratorio-virtual');
  }

  onLaboratorioVolver() {
    this.volverAlMenu();
  }

  // Handlers para estadísticas vivas
  onEstadisticasCompletar() {
    this.marcarCompletada('estadisticas-vivas');
  }

  onEstadisticasVolver() {
    this.volverAlMenu();
  }

  // Handlers para aventura prevención
  onAventuraCompletar() {
    this.marcarCompletada('aventura-prevencion');
  }

  onAventuraVolver() {
    this.volverAlMenu();
  }

  getCompletadaStatus(experienciaId: string): boolean {
    return this.experiencias().find(e => e.id === experienciaId)?.completada || false;
  }
}
