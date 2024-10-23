import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {LoadDataService} from "../../services/load-data.service";
import {DividerComponent} from "../../components/divider/divider.component";
import {HeaderComponent} from "../../components/header/header.component";
import {FooterComponent} from "../../components/footer/footer.component";
import {AsyncPipe, NgIf} from "@angular/common";
import {delay, map, Observable, of} from "rxjs";
import {LoadingSpinnerComponent} from "../../components/loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-choose-question-page',
  standalone: true,
  imports: [
    DividerComponent,
    HeaderComponent,
    FooterComponent,
    NgIf,
    LoadingSpinnerComponent,
    AsyncPipe
  ],
  templateUrl: './choose-question-page.component.html',
  styleUrl: './choose-question-page.component.scss'
})
export class ChooseQuestionPageComponent{

  public dataLoaded$: Observable<boolean>;
  choosingQuestions: boolean  = true;

  constructor(
    public readonly router: Router,
    public readonly loadData: LoadDataService,
  ) {
    const previousPath = localStorage.getItem('lastPath'); // Retrieve prev
    this.dataLoaded$ = of(false)
    if(previousPath){
      this.navigateTo(previousPath)
    }else {
      localStorage.clear();
      this.router.navigate([''])
    }
  }

  navigateTo(path: string): void {
    this.dataLoaded$ = of(true)
    this.dataLoaded$.pipe(
      delay(4000),
      map((val)=> false)
    ).subscribe(()=> {
      this.choosingQuestions = false;

      const previousPath = localStorage.getItem('lastPath'); // Retrieve previous choice

      if (previousPath && previousPath !== path) {
        localStorage.clear();
      }

      // Store the current choice in localStorage
      localStorage.setItem('lastPath', path);
      const questionsFileName = path === 'new' ? 'questions-new' : 'questions'
      const answersFileName = path === 'new' ? 'answers-new' : 'answers'
      this.loadData.loadQuestions(questionsFileName)
      this.loadData.loadAnswers(answersFileName);

      this.dataLoaded$ = this.loadData.dataLoaded;
      this.router.navigate(['/home']);
    })

  }
}
