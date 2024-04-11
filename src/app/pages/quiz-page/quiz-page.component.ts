import { Component } from '@angular/core';
import { ContainerComponent } from '../../components/container/container.component';

@Component({
  selector: 'app-quiz-page',
  standalone: true,
  imports: [ContainerComponent],
  templateUrl: './quiz-page.component.html',
  styleUrl: './quiz-page.component.scss'
})
export class QuizPageComponent {

}
