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

  public categories$: Observable<string[]>;

  constructor(
    public readonly loadData: LoadDataService,
    public readonly router: Router
  ) {
    this.categories$ = loadData.questions.pipe(
      map(questions => Array.from(new Set(questions.map(question => question.part)))),
      map(questions => questions.sort(this.sortByRoman.bind(this)))
    )
  }

  public navigateToCategory(route: string) {
    const regex = /^[IVXLCDM]+/;
    const match = route.match(regex);
    const category = match ? match[0] : '';
    const definition = match ? match.input : ''
    this.router.navigate(['/categories', category], { queryParams: { definition } })
  }

  public romanToDecimal(roman: string): number {
    const romanNumerals: { [key: string]: number } = {
      I: 1,
      V: 5,
      X: 10,
      L: 50,
      C: 100,
      D: 500,
      M: 1000
    };

    let result = 0;
    for (let i = 0; i < roman.length; i++) {
      const current = romanNumerals[roman[i]];
      const next = romanNumerals[roman[i + 1]];

      if (next && current < next) {
        result += next - current;
        i++;
      } else {
        result += current;
      }
    }
    return result;
  }

  public getCategoryText(category: string ){
    const regex = /#\s*\(([^)]+)\)|#\(([^)]+)\)/;

    const match = category.match(regex);
    
    if (match) {
        const testText = match[1] || match[2]; 
        const testTextWithoutHash = testText.replace(/^#\s*/, ''); 
        const otherPart = category.replace(match[0], '').trim();
        return [testTextWithoutHash, otherPart];
    } else {
        return [null, category];
    }
  }

  public sortByRoman(a: string, b: string): number {
    const romanRegex = /^[IVXLCDM]+/;
    const matchA = a.match(romanRegex);
    const matchB = b.match(romanRegex);

    if (!matchA || !matchB) {
      return 0;
    }

    const romanA = matchA[0];
    const romanB = matchB[0];
    const decimalA = this.romanToDecimal(romanA);
    const decimalB = this.romanToDecimal(romanB);
    return decimalA - decimalB;
  }

  public goToHomePage(){
    this.router.navigate([''])
  }
}
