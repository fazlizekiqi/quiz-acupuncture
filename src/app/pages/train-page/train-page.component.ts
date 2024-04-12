import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ContainerComponent } from '../../components/container/container.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap, of, filter } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { QuestionComponent } from '../../components/question/question.component';
import { ProgressBarComponent } from '../../components/progress-bar/progress-bar.component';
import { QuizQuestion } from '../../domain/models';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ResultService } from '../../services/result.service';
import { LoadDataService } from '../../services/load-data.service';

@Component({
  selector: 'app-train-page',
  standalone: true,
  imports: [ContainerComponent, QuestionComponent, ProgressBarComponent, LoadingSpinnerComponent, HttpClientModule, AsyncPipe, NgIf],
  templateUrl: './train-page.component.html',
  styleUrl: './train-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrainPageComponent {


  public question$ = new BehaviorSubject<QuizQuestion | undefined>(undefined)
  public questions$: Observable<QuizQuestion[]>;
  public answeredQuestion = ''
  public answeredQuestions: QuizQuestion[] = [];
  public randomQuestions: QuizQuestion[] = [];
  public showSpinner$ = new BehaviorSubject<boolean>(false)

  constructor(
    private readonly loadData: LoadDataService,
    private readonly router: Router,
    private readonly resultService: ResultService,
    private readonly route: ActivatedRoute
    
  ) {
    this.questions$ = this.loadData.questionWithAnswers;
    this.route.queryParams.subscribe(params => {
      if(params['random'] ){
          this.getShuffledQuestions(params['random'] === 'true' ? true : false);
      }
  });
    

  }

  public getShuffledQuestions(shuffled: boolean) {

    this.questions$.pipe(
      map(questions => {
        if(!!shuffled){
          this.shuffleQuestions(questions);
          return questions;   
        }else {
         return questions.reverse()
        }
        
      })
    ).subscribe(randomQuestions => {
      this.randomQuestions = [...randomQuestions]
      this.newRandomQuestion()
    });
  }

  private shuffleQuestions(questions: QuizQuestion[]) {
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
  }

  public nextQuestion(answer: QuizQuestion) { 
    this.newRandomQuestion();
  }

  private newRandomQuestion() {
    if (this.randomQuestions.length) {
      const randomQuestion = this.randomQuestions.pop()
      this.question$.next(randomQuestion)
    }

  }

  public goToHomePage(){
    this.router.navigate([''])
  }

}
