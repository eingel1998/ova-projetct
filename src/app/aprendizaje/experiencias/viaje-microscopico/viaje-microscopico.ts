import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-viaje-microscopico',
  imports: [CommonModule],
  templateUrl: './viaje-microscopico.html',
  styleUrl: './viaje-microscopico.css',
})
export class ViajeMicroscopico {
  readonly completada = input(false);
  readonly onCompletar = output<void>();
  readonly onVolver = output<void>();

  marcarCompletada() {
    this.onCompletar.emit();
  }

  volverAlMenu() {
    this.onVolver.emit();
  }
}
