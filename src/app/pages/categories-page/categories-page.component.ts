import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DividerComponent } from '../../components/divider/divider.component';
import { LoadDataService } from '../../services/load-data.service';
import { Observable, map } from 'rxjs';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [RouterLink, DividerComponent, AsyncPipe, NgFor, NgIf],
  templateUrl: './categories-page.component.html',
  styleUrl: './categories-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesPageComponent {

  public categories$:Observable<string []>; 

  constructor(
    public readonly loadData: LoadDataService,
    public readonly router:Router
    ){
    this.categories$ = loadData.questions.pipe(
        map(questions => Array.from(new Set(questions.map(question => question.part))))
      )
  }

  public navigateToCategory(route : string ){
    const regex = /^[IVXLCDM]+/;
    const match = route.match(regex);
    const category = match ? match[0] : ''; 
    const definition = match ? match.input : ''
    
    this.router.navigate(['/categories', category], { queryParams:  {definition} })
  }
}
