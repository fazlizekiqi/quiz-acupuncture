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
  selector: 'app-random-page',
  standalone: true,
  imports: [ContainerComponent, QuestionComponent, ProgressBarComponent, LoadingSpinnerComponent, HttpClientModule, AsyncPipe, NgIf],
  templateUrl: './random-page.component.html',
  styleUrl: './random-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RandomPageComponent {

  public question$ = new BehaviorSubject<QuizQuestion | undefined>(undefined)
  public questions$: Observable<QuizQuestion[]>;
  public currentQuestionIndex = { nr: 0 };
  public totalQuestions = 20;
  public answeredQuestion = ''
  public answeredQuestions: QuizQuestion[] = [];
  public randomQuestions: QuizQuestion[] = [];
  public resultButton = { showResult: false }
  public showSpinner$ = new BehaviorSubject<boolean>(false)

  constructor(
    private readonly loadData: LoadDataService,
    private readonly router: Router,
    private readonly resultService: ResultService,

  ) {
    this.questions$ = this.loadData.questions;
    this.getShuffledQuestions();
  }

  public getShuffledQuestions() {
    this.questions$.pipe(
      map(questions => {
        // Shuffle the array using Fisher-Yates algorithm
        for (let i = questions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [questions[i], questions[j]] = [questions[j], questions[i]];
        }

        return questions.slice(0, this.totalQuestions);         // Select first 10 questions
      })
    ).subscribe(randomQuestions => {
      this.randomQuestions = [...randomQuestions]
      this.newRandomQuestion()
    });
  }

  public nextQuestion(answer: QuizQuestion) {
    if (this.currentQuestionIndex.nr < this.totalQuestions) {
      this.currentQuestionIndex.nr++;
      this.currentQuestionIndex = { ...this.currentQuestionIndex }
    }
    this.answeredQuestions.push(answer)
    this.newRandomQuestion();

  }

  public viewResult() {
    this.showSpinner$.next(true)

    setTimeout(() => {
      this.showSpinner$.next(false)
      this.resultService.setResult(this.answeredQuestions)
      this.router.navigate(['/result']);
    }, 2000)

  }

  private newRandomQuestion() {
    if (this.randomQuestions.length) {

      const randomQuestion = this.randomQuestions.pop()
      this.question$.next(randomQuestion)
    }

    if (this.currentQuestionIndex.nr === this.totalQuestions) {
      this.resultButton = { showResult: true }
    }
  }

  public goToHomePage(){
    this.router.navigate([''])
  }
}

