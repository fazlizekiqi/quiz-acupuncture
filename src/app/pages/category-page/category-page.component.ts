import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { combineLatest, map, of, switchMap } from 'rxjs';
import { LoadDataService } from '../../services/load-data.service';
import { QuestionComponent } from '../../components/question/question.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [QuestionComponent, NgIf],
  templateUrl: './category-page.component.html',
  styleUrl: './category-page.component.scss'
})
export class CategoryPageComponent {

  
  public urlParams$ ;
  public questions$;
  public allQuestions?: any;  
  public question?: any;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly loadData : LoadDataService,
    private readonly rt: Router
    ){
    this.urlParams$ = combineLatest([this.route.params, this.route.queryParams]).pipe(
      map(([category,queryParams])=> {
        return {category: category['id'], definition: queryParams['definition']}
      })
    )

    this.questions$ = this.urlParams$.pipe(
      switchMap(params => {
        return this.loadData.findQuestionWithAnswerByCategory(params.definition)
      })
    )

    this.questions$.subscribe(allQuestions => {
      this.allQuestions = allQuestions.reverse(); 
      this.question = this.allQuestions.pop()
    })
      
  }

  public nextQuestion(event: any){
    this.question = this.allQuestions?.pop()
  }

 
  public goToHomePage() {
    this.rt.navigate(['categories'])
  }
}
