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
import {AnalyticsService} from "./services/analytics.service";
import {Events} from "./events";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ContainerComponent, LoadingSpinnerComponent, AsyncPipe, NgIf, ChooseQuestionPageComponent, HeaderComponent, DividerComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit{
  title = 'Quiz Acupunture';


  constructor(
    public readonly router: Router,
    public readonly loadData: LoadDataService,
    public readonly analyticsService: AnalyticsService
  ) {
    this.router.navigate([''])

  }

  ngOnInit(): void {
     const userAgent = navigator.userAgent;
    let browser = ''
    // Simple check for mobile devices
    const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);

    // Basic browser detection
    if (userAgent.includes('Chrome')) {
      browser = 'Chrome';
    } else if (userAgent.includes('Safari')) {
      browser = 'Safari';
    } else if (userAgent.includes('Firefox')) {
      browser = 'Firefox';
    } else {
      browser = 'Other';
    }

    let string = isMobile ?  'MOBILE': 'NON_MOBILE';
    let message = `Mobile: ${string } Browser: ${browser}`;
      this.analyticsService.trackEvent(Events.DEVICE, message, string )
  }

}
