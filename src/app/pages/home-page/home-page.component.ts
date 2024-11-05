import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { DividerComponent } from '../../components/divider/divider.component';
import { ContainerComponent } from '../../components/container/container.component';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import {LoadDataService} from "../../services/load-data.service";
import {AnalyticsService} from "../../services/analytics.service";
import {Events} from "../../events";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink, DividerComponent, ContainerComponent, HeaderComponent, FooterComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit{

  constructor(private readonly activatedRoute: ActivatedRoute,
              private readonly router: Router,
              private readonly analyticsService : AnalyticsService
  ) {
  }

  public navigate(route: string, queryParams: any = {}): void {
    this.analyticsService.trackEvent(Events.QUIZ_TYPE, route, "" )
    this.router.navigate([route], { queryParams });
  }

  public ngOnInit() : void {

    //this.router.navigate(["search"])

  }
}
