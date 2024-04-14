import { AfterViewChecked, AfterViewInit, Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss'
})
export class ProgressBarComponent{

  public currentQuestionIndex: number = 0;
  public progressPercentage: number = 0;
  public length ?: number;

  @Input()
  public set totalQuestions(nr : number){
    if(nr ){
      this.length = nr ;
      this.calculateProgress()
    }
  } ;

  @Input()
  public set questionIndex(index: { nr: number } | null) {
    if (!!index) {
      this.currentQuestionIndex = index.nr
      this.calculateProgress()
    }
  }

  public calculateProgress(): void {
    if (this.length) {
      this.progressPercentage = ((this.currentQuestionIndex) / this.length) * 100;
    }
  }

}
