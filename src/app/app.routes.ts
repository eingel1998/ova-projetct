import { Routes } from '@angular/router';
import { Aprendizaje } from './aprendizaje/aprendizaje';
import { QuizComponent } from './quiz/quiz';
import { Recursos } from './recursos/recursos';

export const routes: Routes = [
  { path: '', redirectTo: '/aprendizaje', pathMatch: 'full' },
  { path: 'aprendizaje', component: Aprendizaje },
  { path: 'quiz', component: QuizComponent },
  { path: 'recursos', component: Recursos },
];
