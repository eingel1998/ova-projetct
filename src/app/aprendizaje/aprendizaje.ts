import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Viaje3D } from './experiencias/viaje-3d/viaje-3d';
import { LaboratorioVirtual } from './experiencias/laboratorio-virtual/laboratorio-virtual';
import { QuizComponent } from '../quiz/quiz';

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
  imports: [CommonModule, Viaje3D, LaboratorioVirtual, QuizComponent],
  templateUrl: './aprendizaje.html',
  styleUrl: './aprendizaje.css',
})
export class Aprendizaje {
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
      id: 'quizzes-interactivos',
      titulo: 'Quizzes Interactivos',
      descripcion: 'Pon a prueba tus conocimientos sobre el VPH',
      icono: '🧠',
      disponible: true,
      completada: false
    },
    {
      id: 'estadisticas-vivas',
      titulo: 'Estadísticas Vivas',
      descripcion: 'Analiza datos globales sobre el VPH',
      icono: '📊',
      disponible: false,
      completada: false
    },
    {
      id: 'aventura-prevencion',
      titulo: 'Aventura de Prevención',
      descripcion: 'Toma decisiones para prevenir el VPH',
      icono: '🛡️',
      disponible: false,
      completada: false
    },
    {
      id: 'biblioteca-interactiva',
      titulo: 'Biblioteca Interactiva',
      descripcion: 'Explora recursos multimedia sobre el VPH',
      icono: '📚',
      disponible: false,
      completada: false
    }
  ]);

  experienciaActual = signal<string | null>(null);
  progresoGeneral = signal(0);

  seleccionarExperiencia(experienciaId: string) {
    const exp = this.experiencias().find(e => e.id === experienciaId);
    if (exp && exp.disponible) {
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

    // Desbloquear siguiente experiencia si existe
    const index = this.experiencias().findIndex(e => e.id === experienciaId);
    if (index >= 0 && index < this.experiencias().length - 1) {
      this.experiencias.update(exps =>
        exps.map((exp, i) =>
          i === index + 1
            ? { ...exp, disponible: true }
            : exp
        )
      );
    }

    // Actualizar progreso general
    const completadas = this.experiencias().filter(e => e.completada).length;
    this.progresoGeneral.set((completadas / this.experiencias().length) * 100);
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

  // Handlers para quizzes
  onQuizCompletar() {
    this.marcarCompletada('quizzes-interactivos');
  }

  onQuizVolver() {
    this.volverAlMenu();
  }

  getCompletadaStatus(experienciaId: string): boolean {
    return this.experiencias().find(e => e.id === experienciaId)?.completada || false;
  }
}
