import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { QuizQuestion } from '../domain/models';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LoadDataService } from './load-data.service';

export interface QuizAnswer {
  part: string,
  questionNumber: number,
  rightAnswer: string
}

@Injectable({
  providedIn: 'root'
})
export class ResultService {

  public result = new BehaviorSubject<QuizQuestion[]>([]);

  constructor(
    private readonly loadData: LoadDataService,
    ) {
  }

  public setResult(data: QuizQuestion[]): void {
    this.loadData.answers.pipe(
    ).subscribe((answers: QuizAnswer[])=> {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
        
          const element = data[key];
          const foundAnswer = answers.find(answer => answer.part.substring(0,10) === element.part.substring(0,10) && element.questionNumber === answer.questionNumber.toString())
          if(foundAnswer){
            element.correctAnswer = foundAnswer.rightAnswer;
            if(element.answerOption === foundAnswer.rightAnswer){
              element.status = 'correct'
            }else {
              element.status = 'wrong'
            }
          }
        }
      }

      data = data.sort((a, b) => {
        const partA = a.part.substring(0, 10);
        const partB = b.part.substring(0, 10);
      
        if (partA < partB) return -1;
        if (partA > partB) return 1;
        return parseInt(a.questionNumber) - parseInt(b.questionNumber);
      });
      this.result.next(data)
    });
  }

  public getData(): Observable<QuizQuestion[]> {
    return this.result.pipe()
  }


}
