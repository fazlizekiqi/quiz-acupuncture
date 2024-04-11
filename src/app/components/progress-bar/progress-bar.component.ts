import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss'
})
export class ProgressBarComponent {

  public currentQuestionIndex: number = 0;
  public progressPercentage: number = 0;

  @Input()
  public totalQuestions: number = 10;

  @Input()
  public set questionIndex(index: { nr: number }) {
    if (!!index) {
      this.currentQuestionIndex =  index.nr
      this.calculateProgress()
    }
  }

  public calculateProgress(): void {
    this.progressPercentage = ((this.currentQuestionIndex ) / this.totalQuestions) * 100;
  }
}
