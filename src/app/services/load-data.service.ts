import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, take } from 'rxjs';
import { QuizQuestion } from '../domain/models';
import { QuizAnswer } from './result.service';

@Injectable({
  providedIn: 'root'
})
export class LoadDataService {

  questions$ = new BehaviorSubject<QuizQuestion[]>([])
  answers$ = new BehaviorSubject<QuizAnswer[]>([])

  constructor(private readonly httpClient: HttpClient) {

  }

  public loadQuestions() {
    this.httpClient.get<any>('assets/questions.json').pipe(
      take(1)
    ).subscribe(questions => this.questions$.next(questions))

  }

  public loadAnswers() {
    this.httpClient.get<any>('assets/answers.json').pipe(
      take(1)
    ).subscribe(answers => this.answers$.next(answers))
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

  public get questions() {
    return this.questions$.pipe()
  }

  public get answers() {
    return this.answers$.pipe()
  }
}
