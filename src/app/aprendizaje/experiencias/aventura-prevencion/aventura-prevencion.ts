import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Escenario {
  id: string;
  titulo: string;
  descripcion: string;
  imagen: string;
  opciones: Opcion[];
}

interface Opcion {
  texto: string;
  consecuencia: string;
  puntosSalud: number;
  puntosPrevencion: number;
  siguienteEscenario?: string;
  finJuego?: boolean;
}

@Component({
  selector: 'app-aventura-prevencion',
  imports: [CommonModule],
  templateUrl: './aventura-prevencion.html',
  styleUrl: './aventura-prevencion.css',
})
export class AventuraPrevencion {
  @Output() onCompletar = new EventEmitter<void>();
  @Output() onVolver = new EventEmitter<void>();

  escenarios: { [key: string]: Escenario } = {
    inicio: {
      id: 'inicio',
      titulo: '¡Bienvenido a la Aventura de Prevención!',
      descripcion: 'Eres un joven estudiante en Riohacha, La Guajira. Has oído hablar del VPH y quieres tomar decisiones responsables para proteger tu salud. ¿Qué harás primero?',
      imagen: '🎓',
      opciones: [
        {
          texto: 'Investigar sobre el VPH en fuentes confiables',
          consecuencia: '¡Excelente decisión! La información es tu mejor aliada.',
          puntosSalud: 10,
          puntosPrevencion: 15,
          siguienteEscenario: 'vacuna'
        },
        {
          texto: 'Hablar con amigos sobre rumores que has oído',
          consecuencia: 'Los rumores pueden ser peligrosos. Mejor buscar información profesional.',
          puntosSalud: 0,
          puntosPrevencion: -5,
          siguienteEscenario: 'rumores'
        }
      ]
    },
    vacuna: {
      id: 'vacuna',
      titulo: 'La Vacunación',
      descripcion: 'Después de informarte, descubres que la vacuna contra el VPH está disponible gratuitamente para jóvenes de 9-17 años. Tus padres están indecisos sobre vacunarte.',
      imagen: '💉',
      opciones: [
        {
          texto: 'Convencer a tus padres con información de la OMS y Ministerio de Salud',
          consecuencia: '¡Perfecto! Te vacunas y proteges tu futuro.',
          puntosSalud: 20,
          puntosPrevencion: 25,
          siguienteEscenario: 'relaciones'
        },
        {
          texto: 'Esperar a que tus padres decidan sin presionar',
          consecuencia: 'La vacunación temprana es ideal. Pierdes una oportunidad importante.',
          puntosSalud: 5,
          puntosPrevencion: 5,
          siguienteEscenario: 'relaciones_tarde'
        }
      ]
    },
    rumores: {
      id: 'rumores',
      titulo: 'Los Peligros de los Rumores',
      descripcion: 'Tus amigos te cuentan que "la vacuna causa infertilidad" y que "el VPH no es tan grave". Te sientes confundido.',
      imagen: '🤔',
      opciones: [
        {
          texto: 'Buscar información en sitios web oficiales de salud',
          consecuencia: '¡Bien hecho! Desmientes los mitos con evidencia científica.',
          puntosSalud: 15,
          puntosPrevencion: 20,
          siguienteEscenario: 'vacuna'
        },
        {
          texto: 'Creer los rumores y no hacer nada',
          consecuencia: 'Los mitos pueden costar caro. Pierdes protección importante.',
          puntosSalud: -10,
          puntosPrevencion: -15,
          siguienteEscenario: 'relaciones_sin_info'
        }
      ]
    },
    relaciones: {
      id: 'relaciones',
      titulo: 'Tu Primera Relación',
      descripcion: 'Ahora eres adolescente y tienes interés en una relación. Quieres ser responsable con tu salud sexual.',
      imagen: '💑',
      opciones: [
        {
          texto: 'Hablar abiertamente con tu pareja sobre protección y exámenes médicos',
          consecuencia: '¡Comunicación saludable! Proteges a ambos.',
          puntosSalud: 15,
          puntosPrevencion: 20,
          siguienteEscenario: 'universidad'
        },
        {
          texto: 'Usar condón pero no hablar del tema',
          consecuencia: 'Buen inicio, pero la comunicación es clave.',
          puntosSalud: 10,
          puntosPrevencion: 10,
          siguienteEscenario: 'universidad'
        },
        {
          texto: 'No usar protección porque "confías" en tu pareja',
          consecuencia: 'La confianza no reemplaza la prevención. Riesgo innecesario.',
          puntosSalud: -20,
          puntosPrevencion: -25,
          siguienteEscenario: 'problema'
        }
      ]
    },
    relaciones_tarde: {
      id: 'relaciones_tarde',
      titulo: 'Relaciones sin Vacuna Previa',
      descripcion: 'Ahora en la universidad, tienes una relación. No te vacunaste antes y te preocupa el VPH.',
      imagen: '🎓',
      opciones: [
        {
          texto: 'Hacerte la vacuna ahora y usar protección',
          consecuencia: 'Nunca es tarde para protegerte. ¡Bien hecho!',
          puntosSalud: 10,
          puntosPrevencion: 15,
          siguienteEscenario: 'universidad'
        },
        {
          texto: 'No hacer nada porque ya es tarde para la vacuna',
          consecuencia: 'La vacuna es efectiva en adultos jóvenes también.',
          puntosSalud: -5,
          puntosPrevencion: -10,
          siguienteEscenario: 'problema'
        }
      ]
    },
    relaciones_sin_info: {
      id: 'relaciones_sin_info',
      titulo: 'Relaciones sin Información',
      descripcion: 'Sin información confiable, tomas decisiones basadas en mitos. Ahora tienes síntomas preocupantes.',
      imagen: '😟',
      opciones: [
        {
          texto: 'Ir inmediatamente al médico para exámenes',
          consecuencia: '¡Decisión crucial! La detección temprana salva vidas.',
          puntosSalud: 5,
          puntosPrevencion: 10,
          siguienteEscenario: 'recuperacion'
        },
        {
          texto: 'Esperar a ver si se resuelve solo',
          consecuencia: 'El VPH puede ser asintomático. No ignores las señales.',
          puntosSalud: -15,
          puntosPrevencion: -20,
          siguienteEscenario: 'complicacion'
        }
      ]
    },
    universidad: {
      id: 'universidad',
      titulo: 'Vida Universitaria',
      descripcion: 'En la universidad, tienes múltiples parejas. Mantienes prácticas seguras.',
      imagen: '📚',
      opciones: [
        {
          texto: 'Hacerte exámenes regulares de Papanicolaou/HPV',
          consecuencia: '¡Prevención completa! Monitoreas tu salud constantemente.',
          puntosSalud: 20,
          puntosPrevencion: 25,
          siguienteEscenario: 'exito'
        },
        {
          texto: 'Solo usar protección, sin exámenes rutinarios',
          consecuencia: 'Buena protección, pero los exámenes son esenciales.',
          puntosSalud: 10,
          puntosPrevencion: 10,
          siguienteEscenario: 'exito_parcial'
        }
      ]
    },
    problema: {
      id: 'problema',
      titulo: 'Complicaciones',
      descripcion: 'Desarrollas verrugas genitales. Es doloroso y embarazoso.',
      imagen: '😰',
      opciones: [
        {
          texto: 'Buscar tratamiento médico inmediato',
          consecuencia: 'El tratamiento temprano previene complicaciones mayores.',
          puntosSalud: 5,
          puntosPrevencion: 10,
          siguienteEscenario: 'recuperacion'
        },
        {
          texto: 'Intentar remedios caseros y no decir nada',
          consecuencia: 'Los remedios caseros pueden empeorar la situación.',
          puntosSalud: -25,
          puntosPrevencion: -30,
          siguienteEscenario: 'complicacion'
        }
      ]
    },
    recuperacion: {
      id: 'recuperacion',
      titulo: 'Camino a la Recuperación',
      descripcion: 'Con tratamiento adecuado, te recuperas. Aprendes la importancia de la prevención.',
      imagen: '🌟',
      opciones: [
        {
          texto: 'Convertirte en educador de salud sexual en tu comunidad',
          consecuencia: '¡Inspirador! Ayudas a otros a evitar tus errores.',
          puntosSalud: 25,
          puntosPrevencion: 30,
          siguienteEscenario: 'exito'
        }
      ]
    },
    complicacion: {
      id: 'complicacion',
      titulo: 'Complicaciones Graves',
      descripcion: 'Las complicaciones avanzan. Necesitas tratamiento especializado.',
      imagen: '🏥',
      opciones: [
        {
          texto: 'Seguir el tratamiento médico y cambiar hábitos',
          consecuencia: 'La recuperación es posible con disciplina.',
          puntosSalud: -10,
          puntosPrevencion: 5,
          siguienteEscenario: 'leccion_aprendida'
        }
      ]
    },
    exito: {
      id: 'exito',
      titulo: '¡Éxito en la Prevención!',
      descripcion: 'Has tomado decisiones responsables toda tu vida. Disfrutas de una salud sexual plena.',
      imagen: '🎉',
      opciones: [
        {
          texto: 'Fin de la aventura - ¡Has ganado!',
          consecuencia: 'Tu conocimiento y acciones previenen enfermedades.',
          puntosSalud: 50,
          puntosPrevencion: 50,
          finJuego: true
        }
      ]
    },
    exito_parcial: {
      id: 'exito_parcial',
      titulo: 'Éxito Moderado',
      descripcion: 'Has tenido buena protección, pero los exámenes regulares te hubieran dado más tranquilidad.',
      imagen: '👍',
      opciones: [
        {
          texto: 'Fin de la aventura - Buen trabajo',
          consecuencia: 'La prevención es un proceso continuo.',
          puntosSalud: 30,
          puntosPrevencion: 30,
          finJuego: true
        }
      ]
    },
    leccion_aprendida: {
      id: 'leccion_aprendida',
      titulo: 'Lección Aprendida',
      descripcion: 'Después de superar complicaciones, te conviertes en defensor de la salud sexual.',
      imagen: '📖',
      opciones: [
        {
          texto: 'Fin de la aventura - Has crecido',
          consecuencia: 'Las experiencias difíciles enseñan las lecciones más valiosas.',
          puntosSalud: 15,
          puntosPrevencion: 25,
          finJuego: true
        }
      ]
    }
  };

  escenarioActual: Escenario = this.escenarios['inicio'];
  puntosSalud = 50;
  puntosPrevencion = 50;
  historia: string[] = [];
  juegoTerminado = false;

  seleccionarOpcion(opcion: Opcion) {
    // Aplicar consecuencias
    this.puntosSalud += opcion.puntosSalud;
    this.puntosPrevencion += opcion.puntosPrevencion;

    // Mantener puntos entre 0 y 100
    this.puntosSalud = Math.max(0, Math.min(100, this.puntosSalud));
    this.puntosPrevencion = Math.max(0, Math.min(100, this.puntosPrevencion));

    // Agregar a historia
    this.historia.push(opcion.consecuencia);

    // Cambiar escenario
    if (opcion.finJuego) {
      this.juegoTerminado = true;
    } else if (opcion.siguienteEscenario) {
      this.escenarioActual = this.escenarios[opcion.siguienteEscenario];
    }
  }

  reiniciarJuego() {
    this.escenarioActual = this.escenarios['inicio'];
    this.puntosSalud = 50;
    this.puntosPrevencion = 50;
    this.historia = [];
    this.juegoTerminado = false;
  }

  getResultadoFinal(): string {
    const total = this.puntosSalud + this.puntosPrevencion;
    if (total >= 150) return '¡Excelente! Has tomado decisiones excepcionales.';
    if (total >= 100) return 'Buen trabajo. Has manejado bien la mayoría de situaciones.';
    if (total >= 50) return 'Aceptable. Hay áreas donde mejorar la prevención.';
    return 'Necesitas aprender más sobre prevención del VPH.';
  }

  marcarCompletada() {
    this.onCompletar.emit();
  }

  volver() {
    this.onVolver.emit();
  }
}
