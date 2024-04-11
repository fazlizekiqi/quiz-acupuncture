import { Component } from '@angular/core';
import { ContainerComponent } from '../../components/container/container.component';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [ContainerComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss'
})
export class SearchPageComponent {

}
