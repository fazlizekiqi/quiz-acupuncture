import {ChangeDetectionStrategy, Component, HostListener} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {DividerComponent} from '../../components/divider/divider.component';
import {LoadDataService} from '../../services/load-data.service';
import {Observable, map} from 'rxjs';
import {AsyncPipe, NgFor, NgIf} from '@angular/common';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

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
  public tooltipVisible = false;
  public tooltipText?: SafeHtml | null;

  constructor(
    public readonly loadData: LoadDataService,
    private sanitizer: DomSanitizer,
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
    this.router.navigate(['/categories', category], {queryParams: {definition}})
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

  public getCategoryText(category: string) {
    const regex = /#\s*\(([^)]+)\)|#\(([^)]+)\)/;

    const match = category.match(regex);

    if (match) {
      const testText = match[1] || match[2];
      const testTextWithoutHash = testText.replace(/^#\s*/, '');
      let otherPart = category.replace(match[0], '').trim();

      const infoMatch = otherPart.match(/info::(.*?)::info/);
      let extractedInfo = null;

      // If a match is found, extract it and remove from otherPart
      if (infoMatch) {
        extractedInfo = infoMatch[1].trim(); // Get the text inside
        // Remove the info text from otherPart
        otherPart = otherPart.replace(infoMatch[0], '').trim();
      }

      return [testTextWithoutHash, otherPart, extractedInfo];
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

  public goToHomePage() {
    this.router.navigate([''])
  }

  public onInfoButtonClick(event: MouseEvent, infoText: string  | null ): void {
    event.stopPropagation();
    this.tooltipVisible = !this.tooltipVisible; // Toggle tooltip visibility
    if(infoText){
      this.tooltipText = this.formatMeridianText(infoText); // Set the tooltip text

    }
  }

  closeTooltip() {
    this.tooltipVisible = false
  }

  formatMeridianText(input: string): SafeHtml {
    // Split the input string into segments using "Punkter på" as a separator
    const segments = input.split(/(Punkter på)/).filter(Boolean);

    // Initialize an array to hold the formatted segments
    const formattedSegments = [];

    // Iterate through the segments
    for (let i = 0; i < segments.length; i++) {
      // Check if the segment starts with "Punkter på"
      if (segments[i].trim() === "Punkter på") {
        // Get the next segment (the title and points)
        const titleSegment = segments[i + 1] ? segments[i + 1].trim() : '';
        if (titleSegment) {
          // Create the title by combining "Punkter på" with the rest of the segment
          const title = `Punkter på ${titleSegment.split('.')[0].trim()}:<br>`;

          // Get the points section after the title
          const pointsSection = titleSegment.slice(title.length).trim();

          // Split the points by comma, trim them, and join with line breaks
          const points = pointsSection.split(/,\s*(?=\w)/)
            .map(point => point.trim())
            .join('');

          // Add the formatted title and points to the segments array
          formattedSegments.push(`${title}\n${points}`);
        }
      }
    }

    // Join the formatted segments with line breaks and return as SafeHtml
    let value = formattedSegments.join('<br><br>').trim();
    console.log(value);
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }


}
