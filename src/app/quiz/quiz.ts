import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string; // Explicación de por qué es correcta
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

@Component({
  selector: 'app-quiz',
  imports: [CommonModule],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css',
})
export class QuizComponent {
  quizzes: Quiz[] = [
    {
      id: 'basics',
      title: 'Conocimientos Básicos sobre el VPH',
      description: 'Evaluar el conocimiento previo de los estudiantes sobre qué es el VPH y sus características.',
      questions: [
        {
          question: '¿Qué es el VPH?',
          options: [
            'Una bacteria que causa infecciones respiratorias',
            'Un virus de transmisión sexual que puede causar cáncer',
            'Una enfermedad del corazón',
            'Un tipo de gripe'
          ],
          correctAnswer: 1,
          explanation: 'El VPH es un virus que se transmite principalmente por contacto sexual y puede causar cáncer.'
        },
        {
          question: '¿Cuántas personas sexualmente activas contraerán el VPH en algún momento de su vida?',
          options: [
            'Entre 10% y 20%',
            'Entre 30% y 40%',
            'Entre 70% y 80%',
            'Entre 90% y 100%'
          ],
          correctAnswer: 2,
          explanation: 'Aproximadamente entre 70% y 80% de las personas sexualmente activas contraerán el VPH en algún momento.'
        },
        {
          question: '¿El VPH puede afectar solo a las mujeres?',
          options: ['Verdadero', 'Falso'],
          correctAnswer: 1,
          explanation: 'El VPH afecta tanto a hombres como a mujeres.'
        },
        {
          question: '¿Qué enfermedad grave está relacionada con el VPH?',
          options: [
            'Diabetes',
            'Cáncer de cuello uterino',
            'Hipertensión',
            'Asma'
          ],
          correctAnswer: 1,
          explanation: 'El VPH está relacionado con el cáncer de cuello uterino.'
        },
        {
          question: '¿En qué etapa de la vida se adquiere frecuentemente el VPH?',
          options: [
            'En la niñez',
            'Durante la adolescencia',
            'En la vejez',
            'Al nacer'
          ],
          correctAnswer: 1,
          explanation: 'El VPH se adquiere frecuentemente durante la adolescencia.'
        }
      ]
    },
    {
      id: 'transmission',
      title: 'Formas de Transmisión del VPH',
      description: 'Verificar la comprensión sobre cómo se transmite el VPH y romper mitos comunes.',
      questions: [
        {
          question: '¿Cómo se transmite principalmente el VPH?',
          options: [
            'Por el aire al toser',
            'Por contacto sexual',
            'Por compartir alimentos',
            'Por picaduras de mosquitos'
          ],
          correctAnswer: 1,
          explanation: 'El VPH se transmite principalmente por contacto sexual.'
        },
        {
          question: '¿Se puede transmitir el VPH incluso sin penetración sexual?',
          options: ['Verdadero', 'Falso'],
          correctAnswer: 0,
          explanation: 'Sí, el VPH puede transmitirse por contacto piel con piel en la zona genital.'
        },
        {
          question: '¿El VPH está relacionado únicamente con la promiscuidad?',
          options: ['Verdadero', 'Falso'],
          correctAnswer: 1,
          explanation: 'Es un mito; cualquier persona sexualmente activa puede contraer el VPH.'
        },
        {
          question: '¿Cuál de las siguientes situaciones NO transmite el VPH?',
          options: [
            'Contacto sexual sin protección',
            'Compartir una bebida con alguien infectado',
            'Contacto piel con piel en la zona genital',
            'Relaciones sexuales orales'
          ],
          correctAnswer: 1,
          explanation: 'Compartir una bebida no transmite el VPH.'
        },
        {
          question: '¿Una persona puede tener VPH sin saberlo?',
          options: [
            'Sí, muchas personas no presentan síntomas',
            'No, siempre hay síntomas visibles'
          ],
          correctAnswer: 0,
          explanation: 'Muchas personas tienen VPH sin síntomas.'
        }
      ]
    },
    {
      id: 'prevention',
      title: 'Prevención del VPH',
      description: 'Evaluar el conocimiento sobre las medidas preventivas disponibles.',
      questions: [
        {
          question: '¿Cuál es el método más efectivo para prevenir el VPH?',
          options: [
            'Lavarse las manos frecuentemente',
            'La vacunación',
            'Tomar vitaminas',
            'Hacer ejercicio'
          ],
          correctAnswer: 1,
          explanation: 'La vacunación es el método más efectivo para prevenir el VPH.'
        },
        {
          question: '¿A qué edad se recomienda la vacunación contra el VPH en Colombia?',
          options: [
            'Entre 3 y 5 años',
            'Entre 9 y 17 años',
            'Entre 20 y 30 años',
            'Solo para mayores de 40 años'
          ],
          correctAnswer: 1,
          explanation: 'En Colombia, se recomienda la vacunación entre 9 y 17 años.'
        },
        {
          question: '¿El uso del preservativo ayuda a reducir el riesgo de contraer el VPH?',
          options: ['Verdadero', 'Falso'],
          correctAnswer: 0,
          explanation: 'Sí, el preservativo reduce el riesgo, aunque no lo elimina completamente.'
        },
        {
          question: '¿La vacuna contra el VPH es gratuita para adolescentes en Colombia?',
          options: ['Verdadero', 'Falso'],
          correctAnswer: 0,
          explanation: 'Sí, la vacuna es gratuita para adolescentes en Colombia.'
        },
        {
          question: '¿Cuántas dosis requiere el esquema completo de vacunación contra el VPH?',
          options: [
            'Una dosis',
            'Dos dosis',
            'Tres dosis',
            'Cuatro dosis'
          ],
          correctAnswer: 1,
          explanation: 'Típicamente 2 dosis antes de los 15 años, 3 después.'
        }
      ]
    },
    {
      id: 'consequences',
      title: 'Consecuencias del VPH',
      description: 'Comprender las consecuencias para la salud relacionadas con el VPH.',
      questions: [
        {
          question: '¿Qué porcentaje de los casos de cáncer de cuello uterino están relacionados con el VPH?',
          options: [
            'Menos del 30%',
            'Aproximadamente 50%',
            'Más del 95%',
            'Ninguno'
          ],
          correctAnswer: 2,
          explanation: 'Más del 95% de los casos de cáncer de cuello uterino están relacionados con el VPH.'
        },
        {
          question: 'Además del cáncer de cuello uterino, ¿qué otras complicaciones puede causar el VPH?',
          options: [
            'Verrugas genitales',
            'Otros tipos de cáncer',
            'Problemas respiratorios (en casos raros)',
            'Todas las anteriores'
          ],
          correctAnswer: 3,
          explanation: 'El VPH puede causar verrugas genitales, otros tipos de cáncer y problemas respiratorios.'
        },
        {
          question: '¿En qué año reportó la OMS 620,000 casos de cáncer de cuello uterino a nivel mundial?',
          options: ['2015', '2019', '2022', '2024'],
          correctAnswer: 1,
          explanation: 'La OMS reportó 620,000 casos en 2019.'
        },
        {
          question: '¿Cuántas muertes causó el cáncer de cuello uterino en 2019 según la OMS?',
          options: ['100,000', '200,000', '342,000', '500,000'],
          correctAnswer: 2,
          explanation: '342,000 muertes en 2019 según la OMS.'
        },
        {
          question: '¿El VPH puede causar cáncer en hombres?',
          options: ['Verdadero', 'Falso'],
          correctAnswer: 0,
          explanation: 'Sí, el VPH puede causar cáncer en hombres, como cáncer de pene o anal.'
        }
      ]
    },
    {
      id: 'detection',
      title: 'Detección Temprana y Pruebas',
      description: 'Conocer los métodos de detección temprana del VPH y cáncer de cuello uterino.',
      questions: [
        {
          question: '¿Cuál es el examen principal para detectar el cáncer de cuello uterino?',
          options: [
            'Radiografía',
            'Citología o Papanicoláu',
            'Análisis de sangre',
            'Ecografía'
          ],
          correctAnswer: 1,
          explanation: 'La citología o Papanicoláu es el examen principal.'
        },
        {
          question: '¿A partir de qué edad se recomienda comenzar las pruebas de detección?',
          options: ['15 años', '21 años', '30 años', '35 años'],
          correctAnswer: 1,
          explanation: 'Generalmente después de los 21 años, dependiendo del país.'
        },
        {
          question: '¿Existe una prueba específica para detectar el VPH?',
          options: ['Verdadero', 'Falso'],
          correctAnswer: 0,
          explanation: 'Sí, existe la prueba de VPH.'
        },
        {
          question: '¿Qué significa la estrategia 90-70-90 de la OMS?',
          options: [
            '90% de vacunación, 70% de tamizaje, 90% de tratamiento',
            '90% de educación, 70% de prevención, 90% de hospitalización',
            '90% de curación, 70% de detección, 90% de recuperación',
            'Ninguna de las anteriores'
          ],
          correctAnswer: 0,
          explanation: '90% de vacunación, 70% de tamizaje, 90% de tratamiento.'
        },
        {
          question: '¿La detección temprana mejora las posibilidades de tratamiento exitoso?',
          options: ['Verdadero', 'Falso'],
          correctAnswer: 0,
          explanation: 'Sí, la detección temprana mejora el tratamiento.'
        }
      ]
    },
    {
      id: 'intercultural',
      title: 'Contexto Intercultural - La Guajira',
      description: 'Relacionar el conocimiento del VPH con el contexto sociocultural de La Guajira.',
      questions: [
        {
          question: '¿Cuál es la cobertura de vacunación contra el VPH en niñas de 9 años en La Guajira?',
          options: ['50%', '26.4%', '9.1%', '70%'],
          correctAnswer: 2,
          explanation: 'La cobertura es del 9.1% en La Guajira.'
        },
        {
          question: '¿Cuántos casos de cáncer invasivo de cuello uterino reportó la Secretaría Departamental de Salud de La Guajira en 2022?',
          options: ['20 casos', '36 casos', '46 casos', '60 casos'],
          correctAnswer: 2,
          explanation: '46 casos reportados en 2022.'
        },
        {
          question: '¿Por qué es importante un enfoque intercultural en la educación sobre el VPH en La Guajira?',
          options: [
            'Porque hay diversidad de comunidades (indígenas, afrodescendientes, mestizas)',
            'Porque hay barreras de idioma y cosmovisión',
            'Para respetar las creencias y tradiciones locales',
            'Todas las anteriores'
          ],
          correctAnswer: 3,
          explanation: 'Todas las razones mencionadas son importantes.'
        },
        {
          question: '¿En qué comunidad indígena de La Guajira se identificó bajo conocimiento sobre el VPH?',
          options: ['Arhuaco', 'Wayuu', 'Kogui', 'Wiwa'],
          correctAnswer: 1,
          explanation: 'En la comunidad Wayuu.'
        },
        {
          question: '¿Qué porcentaje de estudiantes Wayuu identificó al VPH como una infección de transmisión sexual en un estudio de Riohacha?',
          options: ['80%', '60%', '40%', '25%'],
          correctAnswer: 2,
          explanation: '40% de los estudiantes Wayuu.'
        }
      ]
    },
    {
      id: 'myths',
      title: 'Mitos y Realidades sobre el VPH',
      description: 'Desmentir mitos comunes y reforzar conocimientos científicos.',
      questions: [
        {
          question: 'Mito o Realidad: "Solo las personas con múltiples parejas sexuales contraen el VPH"',
          options: ['Mito', 'Realidad'],
          correctAnswer: 0,
          explanation: 'Mito: Cualquier persona sexualmente activa puede contraerlo.'
        },
        {
          question: 'Mito o Realidad: "La vacuna contra el VPH puede causar la enfermedad"',
          options: ['Mito', 'Realidad'],
          correctAnswer: 0,
          explanation: 'Mito: Las vacunas son seguras y no contienen virus vivo.'
        },
        {
          question: 'Mito o Realidad: "El VPH solo afecta a las mujeres"',
          options: ['Mito', 'Realidad'],
          correctAnswer: 0,
          explanation: 'Mito: Afecta a ambos sexos.'
        },
        {
          question: 'Mito o Realidad: "Si estoy vacunada, no necesito hacerme pruebas de detección"',
          options: ['Mito', 'Realidad'],
          correctAnswer: 0,
          explanation: 'Mito: La detección sigue siendo importante.'
        },
        {
          question: 'Mito o Realidad: "El VPH siempre presenta síntomas visibles"',
          options: ['Mito', 'Realidad'],
          correctAnswer: 0,
          explanation: 'Mito: Muchas personas no presentan síntomas.'
        }
      ]
    },
    {
      id: 'responsible',
      title: 'Salud Sexual Responsable',
      description: 'Promover actitudes responsables frente a la salud sexual.',
      questions: [
        {
          question: '¿Qué significa tener una vida sexual responsable?',
          options: [
            'Informarse sobre ITS y métodos de prevención',
            'Respetar las decisiones propias y ajenas',
            'Usar protección adecuada',
            'Todas las anteriores'
          ],
          correctAnswer: 3,
          explanation: 'Todas las opciones son parte de una vida sexual responsable.'
        },
        {
          question: '¿Es importante hablar abiertamente sobre sexualidad en la adolescencia?',
          options: ['Verdadero', 'Falso'],
          correctAnswer: 0,
          explanation: 'Sí, es importante hablar abiertamente.'
        },
        {
          question: '¿Qué factores dificultan la educación sexual en comunidades como Riohacha?',
          options: [
            'Tabúes culturales',
            'Barreras de idioma',
            'Falta de información accesible',
            'Todas las anteriores'
          ],
          correctAnswer: 3,
          explanation: 'Todos los factores mencionados dificultan la educación.'
        },
        {
          question: '¿Dónde pueden los adolescentes buscar información confiable sobre salud sexual?',
          options: [
            'En centros de salud',
            'Con profesionales médicos',
            'En programas educativos escolares',
            'Todas las anteriores'
          ],
          correctAnswer: 3,
          explanation: 'En todos los lugares mencionados.'
        },
        {
          question: '¿El autocuidado incluye informarse sobre el VPH y otras ITS?',
          options: ['Verdadero', 'Falso'],
          correctAnswer: 0,
          explanation: 'Sí, el autocuidado incluye informarse sobre ITS.'
        }
      ]
    }
  ];

  // Estado global
  selectedQuiz: Quiz | null = null;
  currentQuestionIndex = 0;
  selectedAnswer: number | null = null;
  score = 0;
  quizCompleted = false;
  showFeedback = false;
  isCorrect = false;
  feedbackMessage = '';

  // Progreso global
  globalScores: { [quizId: string]: number } = {};
  completedQuizzes: string[] = [];

  @Output() onCompletar = new EventEmitter<{ quizId: string; score: number }>();
  @Output() onVolver = new EventEmitter<void>();

  selectQuiz(quiz: Quiz): void {
    this.selectedQuiz = quiz;
    this.resetQuiz();
  }

  get currentQuestion(): Question {
    return this.selectedQuiz!.questions[this.currentQuestionIndex];
  }

  selectAnswer(index: number): void {
    this.selectedAnswer = index;
  }

  nextQuestion(): void {
    if (this.selectedAnswer !== null) {
      const correct = this.selectedAnswer === this.currentQuestion.correctAnswer;
      this.isCorrect = correct;
      this.feedbackMessage = correct ? '¡Correcto!' : 'Incorrecto. ' + (this.currentQuestion.explanation || '');
      this.showFeedback = true;

      if (correct) {
        this.score++;
      }

      setTimeout(() => {
        this.showFeedback = false;
        if (this.currentQuestionIndex < this.selectedQuiz!.questions.length - 1) {
          this.currentQuestionIndex++;
          this.selectedAnswer = null;
        } else {
          this.quizCompleted = true;
          this.globalScores[this.selectedQuiz!.id] = this.score;
          this.completedQuizzes.push(this.selectedQuiz!.id);
          // emitir evento al componente padre con resultado
          try {
            this.onCompletar.emit({ quizId: this.selectedQuiz!.id, score: this.score });
          } catch (e) { /* no-op */ }
        }
      }, 1200); // feedback rápido para flujo más dinámico
    }
  }

  resetQuiz(): void {
    this.currentQuestionIndex = 0;
    this.selectedAnswer = null;
    this.score = 0;
    this.quizCompleted = false;
    this.showFeedback = false;
  }

  restartQuiz(): void {
    this.resetQuiz();
  }

  backToQuizSelection(): void {
    this.selectedQuiz = null;
    this.resetQuiz();
    try { this.onVolver.emit(); } catch (e) {}
  }

  getTotalScore(): number {
    return Object.values(this.globalScores).reduce((sum, score) => sum + score, 0);
  }

  getTotalQuestions(): number {
    return this.quizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0);
  }

  getCompletedScore(): number {
    return this.completedQuizzes.reduce((sum, quizId) => sum + (this.globalScores[quizId] || 0), 0);
  }

  getCompletedQuestions(): number {
    return this.completedQuizzes.reduce((sum, quizId) => {
      const quiz = this.quizzes.find(q => q.id === quizId);
      return sum + (quiz ? quiz.questions.length : 0);
    }, 0);
  }
}
