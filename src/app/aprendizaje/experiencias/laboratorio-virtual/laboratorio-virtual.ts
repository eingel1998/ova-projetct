import { Component, ElementRef, ViewChild, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CepaVPH {
  id: string;
  nombre: string;
  tipo: 'bajo-riesgo' | 'alto-riesgo';
  numero: number;
  descripcion: string;
  sintomas: string[];
  prevencion: string[];
  imagen: string;
  color: string;
  tamano: number; // tamaño relativo en micrómetros
  forma: 'icosaedrica' | 'filamentosa';
}

interface Herramienta {
  id: string;
  nombre: string;
  icono: string;
  descripcion: string;
  activa: boolean;
}

interface Muestra {
  id: string;
  nombre: string;
  tipo: 'tejido' | 'fluido' | 'lesion';
  descripcion: string;
  cepasDetectadas: string[];
  imagen: string;
}

@Component({
  selector: 'app-laboratorio-virtual',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './laboratorio-virtual.html',
  styleUrls: ['./laboratorio-virtual.css'],
})
export class LaboratorioVirtual implements OnInit, OnDestroy {
  @ViewChild('microscopioCanvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  // Estado del laboratorio
  herramientaActiva: string = 'selector';
  muestraSeleccionada: Muestra | null = null;
  cepaSeleccionada: CepaVPH | null = null;
  zoom: number = 100;
  iluminacion: number = 50;

  // Datos de cepas VPH
  cepasVPH: CepaVPH[] = [
    {
      id: 'vph6',
      nombre: 'VPH Tipo 6',
      tipo: 'bajo-riesgo',
      numero: 6,
      descripcion: 'Cepa de bajo riesgo que causa verrugas genitales. Es una de las cepas más comunes.',
      sintomas: ['Verrugas genitales', 'Lesiones en forma de coliflor', 'Generalmente benignas'],
      prevencion: ['Vacuna Gardasil', 'Uso de condón', 'Examen regular'],
      imagen: '🦠',
      color: '#4CAF50',
      tamano: 55,
      forma: 'icosaedrica'
    },
    {
      id: 'vph11',
      nombre: 'VPH Tipo 11',
      tipo: 'bajo-riesgo',
      numero: 11,
      descripcion: 'Otra cepa de bajo riesgo asociada con verrugas genitales y respiratorias.',
      sintomas: ['Verrugas genitales', 'Papilomatosis respiratoria', 'Lesiones benignas'],
      prevencion: ['Vacuna Gardasil', 'Higiene adecuada', 'Evitar contacto con lesiones'],
      imagen: '🧫',
      color: '#8BC34A',
      tamano: 55,
      forma: 'icosaedrica'
    },
    {
      id: 'vph16',
      nombre: 'VPH Tipo 16',
      tipo: 'alto-riesgo',
      numero: 16,
      descripcion: 'Cepa de alto riesgo responsable del 50% de los casos de cáncer cervical.',
      sintomas: ['Asintomático', 'Cambios celulares precancerosos', 'Cáncer cervical'],
      prevencion: ['Vacuna Cervarix/Gardasil', 'Papanicolaou regular', 'HPV test'],
      imagen: '⚠️',
      color: '#F44336',
      tamano: 55,
      forma: 'icosaedrica'
    },
    {
      id: 'vph18',
      nombre: 'VPH Tipo 18',
      tipo: 'alto-riesgo',
      numero: 18,
      descripcion: 'Segunda cepa más común de alto riesgo, causa cáncer cervical y anal.',
      sintomas: ['Asintomático', 'Neoplasia cervical', 'Cáncer anal'],
      prevencion: ['Vacuna Cervarix/Gardasil', 'Detección temprana', 'Seguimiento médico'],
      imagen: '🚨',
      color: '#E91E63',
      tamano: 55,
      forma: 'icosaedrica'
    },
    {
      id: 'vph31',
      nombre: 'VPH Tipo 31',
      tipo: 'alto-riesgo',
      numero: 31,
      descripcion: 'Cepa de alto riesgo incluida en la vacuna Gardasil 9.',
      sintomas: ['Cambios celulares', 'Lesiones precancerosas', 'Potencial cancerígeno'],
      prevencion: ['Vacuna Gardasil 9', 'Exámenes regulares', 'Estilo de vida saludable'],
      imagen: '🔬',
      color: '#9C27B0',
      tamano: 55,
      forma: 'icosaedrica'
    }
  ];

  // Herramientas disponibles
  herramientas: Herramienta[] = [
    {
      id: 'selector',
      nombre: 'Selector',
      icono: '👆',
      descripcion: 'Seleccionar y examinar muestras',
      activa: true
    },
    {
      id: 'zoom',
      nombre: 'Zoom',
      icono: '🔍',
      descripcion: 'Aumentar el nivel de zoom del microscopio',
      activa: false
    },
    {
      id: 'iluminacion',
      nombre: 'Iluminación',
      icono: '💡',
      descripcion: 'Ajustar la intensidad de luz',
      activa: false
    },
    {
      id: 'analisis',
      nombre: 'Análisis',
      icono: '📊',
      descripcion: 'Realizar análisis molecular',
      activa: false
    },
    {
      id: 'muestreo',
      nombre: 'Muestreo',
      icono: '🧪',
      descripcion: 'Tomar muestras para pruebas',
      activa: false
    }
  ];

  // Muestras disponibles
  muestras: Muestra[] = [
    {
      id: 'tejido-cervical',
      nombre: 'Tejido Cervical',
      tipo: 'tejido',
      descripcion: 'Muestra de biopsia cervical para análisis de VPH',
      cepasDetectadas: ['vph16', 'vph18'],
      imagen: '🧬'
    },
    {
      id: 'fluido-vaginal',
      nombre: 'Fluido Vaginal',
      tipo: 'fluido',
      descripcion: 'Muestra de fluido vaginal para detección de VPH',
      cepasDetectadas: ['vph6', 'vph11', 'vph16'],
      imagen: '💧'
    },
    {
      id: 'lesion-genital',
      nombre: 'Lesión Genital',
      tipo: 'lesion',
      descripcion: 'Biopsia de verruga genital sospechosa',
      cepasDetectadas: ['vph6', 'vph11'],
      imagen: '🎯'
    },
    {
      id: 'tejido-anal',
      nombre: 'Tejido Anal',
      tipo: 'tejido',
      descripcion: 'Muestra anal para screening de VPH',
      cepasDetectadas: ['vph16', 'vph18', 'vph31'],
      imagen: '🔍'
    }
  ];

  // Estado de la simulación
  private animationId: number = 0;
  private ctx!: CanvasRenderingContext2D;
  particulas: any[] = []; // Hacer público para el template
  private tiempo: number = 0;

  // Estado de análisis y muestreo (reemplaza alert())
  analysisInProgress: boolean = false;
  analysisProgress: number = 0;
  analysisResults: string[] = [];
  takenSamples: string[] = [];

  // Sistema simple de toasts/notifications
  toasts: Array<{ id: number; msg: string; type: 'info' | 'success' | 'error' | 'warn' }> = [];
  private toastCounter: number = 1;

  ngOnInit() {
    this.inicializarMicroscopio();
    this.iniciarAnimacion();
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private inicializarMicroscopio() {
    const canvas = this.canvas.nativeElement;
    this.ctx = canvas.getContext('2d')!;

    // Configurar canvas
    canvas.width = 600;
    canvas.height = 400;

    // Dibujar fondo del microscopio
    this.dibujarFondoMicroscopio();
  }

  private dibujarFondoMicroscopio() {
    const ctx = this.ctx;
    const canvas = this.canvas.nativeElement;

    // Gradiente de fondo (campo oscuro del microscopio)
    const gradiente = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, 200
    );
    gradiente.addColorStop(0, '#1a1a2e');
    gradiente.addColorStop(1, '#000000');

    ctx.fillStyle = gradiente;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar retícula del microscopio
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;

    // Líneas horizontales y verticales
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }

    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }
  }

  private iniciarAnimacion() {
    const animar = () => {
      this.tiempo += 0.016; // ~60fps
      this.actualizarParticulas();
      this.dibujarMicroscopio();
      this.animationId = requestAnimationFrame(animar);
    };
    animar();
  }

  private actualizarParticulas() {
    if (!this.muestraSeleccionada) return;

    // Crear nuevas partículas si no hay suficientes
    if (this.particulas.length < 20) {
      this.crearParticula();
    }

    // Actualizar posición de partículas
    this.particulas.forEach(particula => {
      particula.x += particula.vx;
      particula.y += particula.vy;

      // Rebote en bordes
      if (particula.x < 0 || particula.x > this.canvas.nativeElement.width) {
        particula.vx *= -1;
      }
      if (particula.y < 0 || particula.y > this.canvas.nativeElement.height) {
        particula.vy *= -1;
      }
    });
  }

  private crearParticula() {
    if (!this.muestraSeleccionada) return;

    const cepaIds = this.muestraSeleccionada.cepasDetectadas;
    const cepaAleatoria = this.cepasVPH.find(c => cepaIds.includes(c.id));

    if (!cepaAleatoria) return;
    // Guardamos sólo referencia a la cepa y propiedades dinámicas (tamaño se calcula en render)
    const particula = {
      x: Math.random() * this.canvas.nativeElement.width,
      y: Math.random() * this.canvas.nativeElement.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      cepaId: cepaAleatoria.id,
      color: cepaAleatoria.color,
      forma: cepaAleatoria.forma,
      intensidad: Math.random()
    };

    this.particulas.push(particula);
  }

  private dibujarMicroscopio() {
    this.dibujarFondoMicroscopio();

    // Dibujar partículas
    this.particulas.forEach(particula => {
      this.dibujarParticula(particula);
    });

    // Aplicar efectos de iluminación y zoom
    this.aplicarEfectosVisuales();
  }

  private dibujarParticula(particula: any) {
    const ctx = this.ctx;
    ctx.save();

    // Posición
    ctx.translate(particula.x, particula.y);

    // Efectos de iluminación
    const alpha = (this.iluminacion / 100) * particula.intensidad;
    ctx.globalAlpha = Math.max(0.12, alpha);

    // Recuperar datos de la cepa para dibujar dinámicamente según zoom
    const cepa = this.cepasVPH.find(c => c.id === particula.cepaId) || null;
    const baseSize = cepa ? cepa.tamano : 40;
    // tamaño en px calculado por zoom
    const radio = baseSize * (this.zoom / 100) * 0.08;

    // Color
    ctx.fillStyle = particula.color;
    ctx.strokeStyle = this._shadeColor(particula.color, -30);
    ctx.lineWidth = Math.max(1, radio * 0.08);

    // Si el zoom es bajo, dibujamos un punto simple para rendimiento
    if (this.zoom < 150) {
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(1.2, radio * 0.35), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    // Detalle para icosaédrica: núcleo + cápside con picos
    if (particula.forma === 'icosaedrica') {
      // cápside
      ctx.beginPath();
      const spikes = Math.max(8, Math.floor(8 + this.zoom / 120));
      for (let i = 0; i < spikes; i++) {
        const angle = (i / spikes) * Math.PI * 2;
        const r = radio * (1 + 0.25 * Math.sin(i + this.tiempo));
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();

      // picos (spikes)
      ctx.beginPath();
      for (let i = 0; i < spikes; i++) {
        const angle = (i / spikes) * Math.PI * 2;
        const x1 = Math.cos(angle) * radio * 1.05;
        const y1 = Math.sin(angle) * radio * 1.05;
        const x2 = Math.cos(angle) * radio * 1.45;
        const y2 = Math.sin(angle) * radio * 1.45;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
      }
      ctx.stroke();

      // núcleo central
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(1, radio * 0.35), 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }

    // Filamentosa: dibujar un óvalo alargado y una "cola"
    if (particula.forma === 'filamentosa') {
      ctx.beginPath();
      ctx.ellipse(0, 0, radio * 1.2, radio * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();

      // cola
      ctx.beginPath();
      ctx.moveTo(radio * 0.9, 0);
      ctx.lineTo(radio * 1.6, -radio * 0.4);
      ctx.lineTo(radio * 1.6, radio * 0.4);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  // Pequeña utilidad para oscurecer color hex
  private _shadeColor(hex: string, percent: number) {
    try {
      const c = hex.replace('#', '');
      const num = parseInt(c, 16);
      const r = (num >> 16) + percent;
      const g = ((num >> 8) & 0x00FF) + percent;
      const b = (num & 0x0000FF) + percent;
      const newR = Math.max(0, Math.min(255, r));
      const newG = Math.max(0, Math.min(255, g));
      const newB = Math.max(0, Math.min(255, b));
      return '#' + (newR << 16 | newG << 8 | newB).toString(16).padStart(6, '0');
    } catch {
      return '#000000';
    }
  }

  private aplicarEfectosVisuales() {
    const ctx = this.ctx;

    // Efecto de iluminación general
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = `rgba(255, 255, 255, ${this.iluminacion / 500})`;
    ctx.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    ctx.restore();

    // Indicador de zoom
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.fillText(`Zoom: ${this.zoom}x`, 10, 20);
    ctx.fillText(`Iluminación: ${this.iluminacion}%`, 10, 35);
    ctx.restore();
  }

  // Métodos públicos para la interfaz
  seleccionarHerramienta(herramientaId: string) {
    this.herramientas.forEach(h => h.activa = false);
    const herramienta = this.herramientas.find(h => h.id === herramientaId);
    if (herramienta) {
      herramienta.activa = true;
      this.herramientaActiva = herramientaId;
    }
  }

  seleccionarMuestra(muestra: Muestra) {
    this.muestraSeleccionada = muestra;
    this.particulas = []; // Limpiar partículas anteriores
    this.cepaSeleccionada = null;
  }

  seleccionarCepa(cepa: CepaVPH) {
    this.cepaSeleccionada = cepa;
  }

  ajustarZoom(cambio: number) {
    // Si cambio es un delta o un valor absoluto (por slider)
    if (typeof cambio === 'number') {
      // cuando viene de botones: suelen enviar ±50
      this.zoom = Math.max(50, Math.min(1000, this.zoom + cambio));
    }
  }

  // Establecer zoom absoluto (viene del slider)
  setZoom(value: number) {
    const v = Math.round(Number(value) || 100);
    this.zoom = Math.max(50, Math.min(1000, v));
  }

  // Establecer iluminación absoluta (viene del slider)
  setIluminacion(value: number) {
    const v = Math.round(Number(value) || 50);
    this.iluminacion = Math.max(0, Math.min(100, v));
  }

  ajustarIluminacion(cambio: number) {
    this.iluminacion = Math.max(0, Math.min(100, this.iluminacion + cambio));
  }

  realizarAnalisis() {
    if (!this.muestraSeleccionada) {
      this.showToast('Selecciona una muestra antes de realizar el análisis', 'warn');
      return;
    }

    // Iniciar simulación de análisis con barra de progreso
    if (this.analysisInProgress) return;
    this.analysisInProgress = true;
    this.analysisProgress = 0;
    this.analysisResults = [];

    const stepMs = 80;
    const totalSteps = 20;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      this.analysisProgress = Math.round((step / totalSteps) * 100);
      if (step >= totalSteps) {
        clearInterval(interval);
        // Generar resultados simulados
        this.analysisResults = this.muestraSeleccionada!.cepasDetectadas.map(cepaId => {
          const cepa = this.cepasVPH.find(c => c.id === cepaId);
          return cepa ? `${cepa.nombre}: POSITIVO` : `${cepaId}: POSITIVE`;
        });
        this.analysisInProgress = false;
        this.showToast('Análisis completado', 'success');
      }
    }, stepMs);
  }

  tomarMuestra() {
    if (!this.muestraSeleccionada) {
      this.showToast('Selecciona una muestra antes de tomarla', 'warn');
      return;
    }

    // Añadir a lista local de muestras tomadas y mostrar toast en vez de alert
    this.takenSamples.push(this.muestraSeleccionada.id);
    this.showToast(`Muestra "${this.muestraSeleccionada.nombre}" tomada correctamente`, 'success');
  }

  clearAnalysis() {
    this.analysisResults = [];
    this.analysisProgress = 0;
  }

  // Toaster pequeño
  showToast(msg: string, type: 'info' | 'success' | 'error' | 'warn' = 'info', duration = 3000) {
    const id = this.toastCounter++;
    this.toasts.push({ id, msg, type });
    setTimeout(() => this.dismissToast(id), duration);
  }

  dismissToast(id: number) {
    const idx = this.toasts.findIndex(t => t.id === id);
    if (idx >= 0) this.toasts.splice(idx, 1);
  }

  // Getters para el template
  getCepasDetectadas(): CepaVPH[] {
    if (!this.muestraSeleccionada) return [];
    return this.cepasVPH.filter(cepa =>
      this.muestraSeleccionada!.cepasDetectadas.includes(cepa.id)
    );
  }

  getHerramientaActiva(): Herramienta | undefined {
    return this.herramientas.find(h => h.activa);
  }

  // Event emitters para navegación
  @Output() onVolver = new EventEmitter<void>();
  @Output() onCompletar = new EventEmitter<void>();

  volver() {
    this.onVolver.emit();
  }

  completarExperiencia() {
    this.onCompletar.emit();
  }
}
