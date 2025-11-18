import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../services/supabase.service';

import { QUIZZES, Quiz, Question } from './quiz.data';

@Component({
  selector: 'app-quiz',
  imports: [CommonModule],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css',
})
export class QuizComponent {
  private supabase = inject(SupabaseService);

  quizzes: Quiz[] = QUIZZES;

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

  constructor() { }

  ngOnInit() {
    this.loadProgress();

    // Listen for auth changes to reload progress when user signs in or session restores
    this.supabase.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') {
        this.loadProgress();
      }
    });
  }

  async loadProgress() {
    try {
      const user = await this.supabase.getCurrentUser();
      if (user) {
        const progress = await this.supabase.getProgress(user.id);
        // Reset local state before merging to avoid duplicates if called multiple times
        this.completedQuizzes = [];
        this.globalScores = {};

        progress?.forEach((p: any) => {
          if (p.experiencia_id.startsWith('quiz_')) {
            const quizId = p.experiencia_id.replace('quiz_', '');
            this.globalScores[quizId] = p.score || 0;
            if (p.completed && !this.completedQuizzes.includes(quizId)) {
              this.completedQuizzes.push(quizId);
            }
          }
        });
      }
    } catch (err) {
      console.warn('No se pudo cargar progreso de quizzes:', err);
    }
  }

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
          if (!this.completedQuizzes.includes(this.selectedQuiz!.id)) {
            this.completedQuizzes.push(this.selectedQuiz!.id);
          }

          // Guardar en Supabase
          this.saveProgress(this.selectedQuiz!.id, this.score);

          // emitir evento al componente padre con resultado
          try {
            this.onCompletar.emit({ quizId: this.selectedQuiz!.id, score: this.score });
          } catch (e) { /* no-op */ }
        }
      }, 1200); // feedback rápido para flujo más dinámico
    }
  }

  async saveProgress(quizId: string, score: number) {
    try {
      const user = await this.supabase.getCurrentUser();
      if (user) {
        const totalQuestions = this.selectedQuiz?.questions.length || 0;
        await this.supabase.upsertProgress(user.id, `quiz_${quizId}`, {
          score: score,
          total_questions: totalQuestions,
          completed: true,
          last_updated: new Date().toISOString()
        });
      }
    } catch (err) {
      console.warn('No se pudo guardar progreso del quiz:', err);
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
    try { this.onVolver.emit(); } catch (e) { }
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
