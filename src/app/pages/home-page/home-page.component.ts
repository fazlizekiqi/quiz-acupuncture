import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DividerComponent } from '../../components/divider/divider.component';
import { ContainerComponent } from '../../components/container/container.component';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink, DividerComponent, ContainerComponent, HeaderComponent, FooterComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {

}
