import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject, combineLatest, map, take, tap, filter, delay} from 'rxjs';
import { QuizQuestion } from '../domain/models';
import { QuizAnswer } from './result.service';

@Injectable({
  providedIn: 'root'
})
export class LoadDataService {

  questions$ = new BehaviorSubject<QuizQuestion[]>([])
  answers$ = new BehaviorSubject<QuizAnswer[]>([])
  questionsLoaded$ = new BehaviorSubject<boolean>(false)
  answerLoaded$ = new BehaviorSubject<boolean>(false)

  constructor(private readonly httpClient: HttpClient) {
  }
  public loadQuestions(questionsType : string) {
    this.httpClient.get<any>(`assets/${questionsType}.json`).pipe(
      take(1)
    ).subscribe(questions => {
      this.questions$.next(questions);
      this.questionsLoaded$.next(true)
    })

  }

  public loadAnswers(answersType: string) {
    this.httpClient.get<any>(`assets/${answersType}.json`).pipe(
      take(1)
    ).subscribe(answers => {
      this.answers$.next(answers)
      this.answerLoaded$.next(true);
    })
  }

  public get dataLoaded(){
    return combineLatest([this.questionsLoaded$.pipe(), this.answerLoaded$.pipe()]).pipe(
      delay(4000),
      map(([questionLoaded, answerLoaded]) => questionLoaded && answerLoaded),
    );
  }


  public get questionWithAnswers() {
    return combineLatest([this.questions, this.answers]).pipe(
      map(([questionsArr, answersArr]) => {

        questionsArr.forEach(question => {
          const correspondingAnswer = answersArr.find(answer => answer.part.substring(0, 10) === question.part.substring(0, 10) && question.questionNumber === answer.questionNumber.toString());
          question.correctAnswer = correspondingAnswer?.rightAnswer;
        });
        return questionsArr; // Return the updated questions array with answers
      })
    );
  }

  public findQuestionWithAnswerByCategory(category: string ){
    return this.questionWithAnswers.pipe(
      map((questions: any) =>  {

        return  questions.filter((qs: any) => qs.part.toUpperCase() === category.toUpperCase())

      })
    )
  }

  public get questions() {
    return this.questions$.pipe()
  }

  public get answers() {
    return this.answers$.pipe()
  }
}
