import { Routes } from '@angular/router';

import { QuizPageComponent } from './pages/quiz-page/quiz-page.component';
import { AppComponent } from './app.component';
import { RandomPageComponent } from './pages/random-page/random-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { ResultPageComponent } from './pages/result-page/result-page.component';
import { TrainPageComponent } from './pages/train-page/train-page.component';
import { CategoriesPageComponent } from './pages/categories-page/categories-page.component';
import { CategoryPageComponent } from './pages/category-page/category-page.component';


export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'train', component: TrainPageComponent },  
  { path: 'test', component: RandomPageComponent },
  { path: 'result', component: ResultPageComponent },
  { path: 'categories', component: CategoriesPageComponent },
  { path: 'categories/:id', component: CategoryPageComponent },
  { path: 'search', component: SearchPageComponent },  
];

