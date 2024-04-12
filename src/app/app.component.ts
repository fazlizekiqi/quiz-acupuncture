import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { ContainerComponent } from './components/container/container.component';
import { LoadDataService } from './services/load-data.service';
import { BehaviorSubject, tap } from 'rxjs';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ContainerComponent, LoadingSpinnerComponent, AsyncPipe, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'Quiz Acupunture';

  public dataLoaded$;

  constructor(
    public readonly router: Router,
    public  readonly loadData: LoadDataService
    ){
      
      this.loadData.loadQuestions()
      this.loadData.loadAnswers();
      this.dataLoaded$ = this.loadData.dataLoaded
      // this.router.navigate(['train'])
  }

}
