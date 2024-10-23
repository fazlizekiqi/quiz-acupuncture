import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterModule, RouterOutlet} from '@angular/router';
import {ContainerComponent} from './components/container/container.component';
import {LoadDataService} from './services/load-data.service';
import {BehaviorSubject, Observable, of, tap} from 'rxjs';
import {LoadingSpinnerComponent} from './components/loading-spinner/loading-spinner.component';
import {AsyncPipe, NgIf} from '@angular/common';
import {ChooseQuestionPageComponent} from "./pages/choose-question-page/choose-question-page.component";
import {HeaderComponent} from "./components/header/header.component";
import {DividerComponent} from "./components/divider/divider.component";
import {FooterComponent} from "./components/footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ContainerComponent, LoadingSpinnerComponent, AsyncPipe, NgIf, ChooseQuestionPageComponent, HeaderComponent, DividerComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent{
  title = 'Quiz Acupunture';


  constructor(
    public readonly router: Router,
    public readonly loadData: LoadDataService,
  ) {
    this.router.navigate([''])



  }

}
