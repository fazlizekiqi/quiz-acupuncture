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

  public userAgent: string = '';
  public  isMobile: boolean= '';
  public  browser: string= '';

  constructor(
    public readonly router: Router,
    public readonly loadData: LoadDataService,
    public readonly analyticsService: AnalyticsService
  ) {
    this.router.navigate([''])

  }

  ngOnInit(): void {
    this.userAgent = navigator.userAgent;

    // Simple check for mobile devices
    this.isMobile = /iPhone|iPad|iPod|Android/i.test(this.userAgent);

    // Basic browser detection
    if (this.userAgent.includes('Chrome')) {
      this.browser = 'Chrome';
    } else if (this.userAgent.includes('Safari')) {
      this.browser = 'Safari';
    } else if (this.userAgent.includes('Firefox')) {
      this.browser = 'Firefox';
    } else {
      this.browser = 'Other';
    }

    let message = `Mobile: ${this.isMobile} Browser: ${this.browser}`;
      this.analyticsService.trackEvent(Events.DEVICE, message, this.isMobile )
  }

}
