import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { ContainerComponent } from './components/container/container.component';
import { LoadDataService } from './services/load-data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Quiz Acupunture';

  constructor(
    public readonly router: Router,
    public  readonly loadData: LoadDataService
    ){
      this.loadData.loadQuestions()
      this.loadData.loadAnswers();
      // this.router.navigate(['train'])
  }

}
