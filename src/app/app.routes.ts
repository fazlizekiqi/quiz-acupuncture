import { Routes } from '@angular/router';

import { QuizPageComponent } from './pages/quiz-page/quiz-page.component';
import { AppComponent } from './app.component';
import { RandomPageComponent } from './pages/random-page/random-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { ResultPageComponent } from './pages/result-page/result-page.component';
import { TrainPageComponent } from './pages/train-page/train-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'train', component: TrainPageComponent },  
  { path: 'test', component: RandomPageComponent },
  { path: 'result', component: ResultPageComponent },
  { path: 'search', component: SearchPageComponent },  
];

