import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Estadistica {
  titulo: string;
  valor: number;
  unidad: string;
  descripcion: string;
  color: string;
}

interface DatosGrafico {
  label: string;
  value: number;
  color: string;
}

@Component({
  selector: 'app-estadisticas-vivas',
  imports: [CommonModule],
  templateUrl: './estadisticas-vivas.html',
  styleUrl: './estadisticas-vivas.css',
})
export class EstadisticasVivas {
  @Output() onCompletar = new EventEmitter<void>();
  @Output() onVolver = new EventEmitter<void>();

  estadisticasGlobales: Estadistica[] = [
    {
      titulo: 'Casos Anuales de Cáncer Cervical',
      valor: 620000,
      unidad: 'casos',
      descripcion: 'Según datos de la OMS para 2019',
      color: '#e74c3c'
    },
    {
      titulo: 'Muertes por Cáncer Cervical',
      valor: 342000,
      unidad: 'muertes',
      descripcion: '342,000 muertes anuales a nivel mundial',
      color: '#c0392b'
    },
    {
      titulo: 'Prevalencia del VPH',
      valor: 80,
      unidad: '%',
      descripcion: '70-80% de personas sexualmente activas contraerán VPH',
      color: '#f39c12'
    },
    {
      titulo: 'Cobertura Vacunación Colombia',
      valor: 85,
      unidad: '%',
      descripcion: 'Cobertura nacional de vacunación contra VPH',
      color: '#27ae60'
    }
  ];

  datosLaGuajira: Estadistica[] = [
    {
      titulo: 'Casos Cáncer Cervical 2022',
      valor: 46,
      unidad: 'casos',
      descripcion: 'Reportados por Secretaría Departamental de Salud',
      color: '#e74c3c'
    },
    {
      titulo: 'Cobertura Vacunación Niñas 9 años',
      valor: 9.1,
      unidad: '%',
      descripcion: 'Cobertura extremadamente baja en La Guajira',
      color: '#f39c12'
    },
    {
      titulo: 'Conocimiento sobre VPH',
      valor: 40,
      unidad: '%',
      descripcion: 'Estudiantes Wayuu que identifican VPH como ITS',
      color: '#3498db'
    }
  ];

  datosGraficoBarras: DatosGrafico[] = [
    { label: 'Cáncer Cervical', value: 95, color: '#e74c3c' },
    { label: 'Cáncer Anal', value: 90, color: '#9b59b6' },
    { label: 'Cáncer Vulvar', value: 40, color: '#f39c12' },
    { label: 'Cáncer Vaginal', value: 70, color: '#e67e22' },
    { label: 'Cáncer de Pene', value: 50, color: '#27ae60' }
  ];

  datosGraficoPastel: DatosGrafico[] = [
    { label: 'VPH 16', value: 50, color: '#e74c3c' },
    { label: 'VPH 18', value: 20, color: '#9b59b6' },
    { label: 'Otros Alto Riesgo', value: 20, color: '#f39c12' },
    { label: 'Bajo Riesgo', value: 10, color: '#27ae60' }
  ];

  vistaActual = 'global'; // 'global' | 'guajira' | 'comparativo'

  cambiarVista(vista: string) {
    this.vistaActual = vista;
  }

  getMaxValue(datos: DatosGrafico[]): number {
    return Math.max(...datos.map(d => d.value));
  }

  getBarHeight(value: number, maxValue: number): number {
    return (value / maxValue) * 200; // altura máxima de 200px
  }

  getPieTotal(): number {
    return this.datosGraficoPastel.reduce((sum, d) => sum + d.value, 0);
  }

  getPiePath(value: number, total: number, index: number, radius: number = 80): string {
    const angle = (value / total) * 2 * Math.PI;
    const startAngle = index === 0 ? 0 : (this.datosGraficoPastel.slice(0, index).reduce((sum, d) => sum + d.value, 0) / total) * 2 * Math.PI;
    const endAngle = startAngle + angle;

    const x1 = radius * Math.cos(startAngle - Math.PI / 2);
    const y1 = radius * Math.sin(startAngle - Math.PI / 2);
    const x2 = radius * Math.cos(endAngle - Math.PI / 2);
    const y2 = radius * Math.sin(endAngle - Math.PI / 2);

    const largeArcFlag = angle > Math.PI ? 1 : 0;

    return `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  }

  marcarCompletada() {
    this.onCompletar.emit();
  }

  volver() {
    this.onVolver.emit();
  }
}
