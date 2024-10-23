import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {BehaviorSubject, combineLatest, map, of, switchMap, take, tap} from 'rxjs';
import {LoadDataService} from '../../services/load-data.service';
import {QuestionComponent} from '../../components/question/question.component';
import {AsyncPipe, NgIf} from '@angular/common';
import {QuizQuestion} from '../../domain/models';
import {ProgressBarComponent} from '../../components/progress-bar/progress-bar.component';
import {ResultService} from "../../services/result.service";
import {LoadingSpinnerComponent} from "../../components/loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [QuestionComponent, NgIf, ProgressBarComponent, AsyncPipe, LoadingSpinnerComponent],
  templateUrl: './category-page.component.html',
  styleUrl: './category-page.component.scss'
})
export class CategoryPageComponent {


  public urlParams$;
  public questions$;
  public allQuestions?: any;
  public question?: any;
  public currentQuestionIndex: any;
  public unfilteredQuestions: any;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly resultService: ResultService,
    private readonly loadData: LoadDataService,
    private readonly rt: Router
  ) {
    this.urlParams$ = combineLatest([this.route.params, this.route.queryParams]).pipe(
      map(([category, queryParams]) => {
        return {category: category['id'], definition: queryParams['definition']}
      })
    )


    this.questions$ = this.getQuestions()

    this.questions$.subscribe(allQuestions => {
      this.unfilteredQuestions = allQuestions;
      this.allQuestions = allQuestions.reverse();
      this.allQuestions = this.allQuestions.filter((question: QuizQuestion) => !question.answerOption)
      this.question = this.allQuestions.pop()
    })

  }

  private getQuestions() {
    return this.urlParams$.pipe(
      switchMap(params => {
        const definition = localStorage.getItem(params.definition);
        if (definition) {

          return of(JSON.parse(definition));
        }
        return this.loadData.findQuestionWithAnswerByCategory(params.definition).pipe(
          tap(questions => localStorage.setItem(params.definition, JSON.stringify(questions)))
        );
      })
    );
  }

  public getCurrentQuestionNumber() {
    return this.getQuestions().pipe(
      map(allQuestions => {
        const unansweredQuestion = this.allQuestions.filter((question: QuizQuestion) => !question.answerOption)
        return {nr: (allQuestions.length - unansweredQuestion.length)}
      })
    )
  }

  public getRightAnswers() {
    return this.getQuestions().pipe(
      map(questions => {
        return questions.filter((question: QuizQuestion) => question.answerOption === question.correctAnswer).length
      })
    )
  }

  public getWrongAnswers() {
    return this.getQuestions().pipe(
      map(questions => {
        const answeredQuestions = questions.filter((question: QuizQuestion) => !!question.answerOption)
        if (answeredQuestions.length) {
          return answeredQuestions.filter((question: QuizQuestion) => question.answerOption !== question.correctAnswer).length
        }
        return 0;
      })
    )

  }

  public answeredQuestions: QuizQuestion[] = [];

  public nextQuestion(event: any) {

    let part = localStorage.getItem(event.part);
    if (part) {
      let newPart: any[] = JSON.parse(part);
      newPart = newPart?.map(question => {
        if (question.questionNumber === event.questionNumber) {
          return event;
        }
        return question;
      })
      this.answeredQuestions = newPart;
      localStorage.setItem(event.part, JSON.stringify(newPart))

      this.question = this.allQuestions?.pop()
    }


  }

  public showQuestions() {
    return this.unfilteredQuestions.length !== this.currentQuestionIndex;
  }

  public goToHomePage() {
    this.rt.navigate(['categories'])
  }

  public resetPart() {
    this.urlParams$.pipe(
      take(1),
      tap(params => localStorage.removeItem(params.definition)),
    ).subscribe(() => {
      this.questions$ = this.getQuestions()
      this.questions$.subscribe(allQuestions => {
        this.unfilteredQuestions = allQuestions;
        this.allQuestions = allQuestions.reverse();
        this.allQuestions = this.allQuestions.filter((question: QuizQuestion) => !question.answerOption)
        this.question = this.allQuestions.pop();
        this.answeredQuestions = [];
      })
    })

  }

  public showSpinner$ = new BehaviorSubject<boolean>(false)

  public viewResult() {
    this.showSpinner$.next(true)
    setTimeout(() => {
      this.showSpinner$.next(false)

      this.urlParams$.pipe(
        map(params => {
          const definition = localStorage.getItem(params.definition);
          if (definition) {
              return JSON.parse(definition)
          }
        })
      ).subscribe((all) => {
        this.resultService.setResult(all)
        this.router.navigate(['/result']);
        this.resetPart()
      })

    }, 4000)

  }
}



