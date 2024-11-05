import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {ContainerComponent} from '../../components/container/container.component';
import {DividerComponent} from "../../components/divider/divider.component";
import {HeaderComponent} from "../../components/header/header.component";

import {BehaviorSubject, combineLatest, Observable} from "rxjs";
import {map} from 'rxjs/operators';
import {AsyncPipe, NgClass, NgFor, NgIf, NgTemplateOutlet} from "@angular/common";
import {QuizQuestion} from '../../domain/models';
import {FooterComponent} from "../../components/footer/footer.component";
import {LoadDataService} from "../../services/load-data.service";
import {FormsModule} from "@angular/forms";
import {AnalyticsService} from "../../services/analytics.service";
import {Events} from "../../events";

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [ContainerComponent, DividerComponent, HeaderComponent, FooterComponent, AsyncPipe, NgIf, NgFor, NgClass, NgTemplateOutlet, FormsModule],
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchPageComponent {
  public groupedAccordionItems$: Observable<any>;
  public filteredAccordionItems$: Observable<any>;
  public accordionItemKeys$: Observable<string[]>;
  private searchQuery$ = new BehaviorSubject<string>(''); // To store the search query

  constructor(
    private readonly loadDataService: LoadDataService,
    private cdr: ChangeDetectorRef,
    private readonly  analyticsService: AnalyticsService
  ) {
    this.groupedAccordionItems$ = this.loadDataService.questionWithAnswers.pipe(
      map(val => {
        return val.reduce((acc: GroupedAccordionItems, obj) => {
          const q = obj as QuizQuestion;
          const category = q.part;

          q.expanded = false
          if (!acc[category]) {
            acc[category] = [];
          }

          acc[category].push(q);
          return acc;
        }, {});

      })
    )

    this.accordionItemKeys$ = this.groupedAccordionItems$.pipe(
      map((obj: QuizQuestion) => Object.keys(obj))
    )

    this.filteredAccordionItems$ = combineLatest([
      this.groupedAccordionItems$,
      this.searchQuery$
    ]).pipe(
      map(([groupedAccordionItems, searchQuery]) => {
        if (!searchQuery) return groupedAccordionItems;

        const filteredItems = {};
        for (const category of Object.keys(groupedAccordionItems)) {
          // @ts-ignore
          filteredItems[category] = groupedAccordionItems[category].filter((item: any) =>
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.questionNumber.toString().includes(searchQuery)
          );
        }

        return filteredItems;
      })
    );
  }

  public truncateText(text: string): string {
    const isLaptop = window.innerWidth >= 768;
    const adjustedMaxLength = isLaptop ? 125 : 50;
    return text.length > adjustedMaxLength ? text.substring(0, adjustedMaxLength) + '...' : text;
  }

  public toggleExpanded(item: QuizQuestion) {
    item.expanded = !item.expanded;
    this.cdr.markForCheck();
  }

  getItemsForKey(key: string, groupedAccordionItems: any): any[] {
    return groupedAccordionItems[key] || [];
  }

  formatCategory(otherPart: string) {
    const infoMatch = otherPart.match(/info::(.*?)::info/);
    if (infoMatch) {
      otherPart = otherPart.replace(infoMatch[0], '').trim();
      return otherPart
    }
    return otherPart;
  }

  public checkForAnswer(option: string, item: QuizQuestion) {
    if (item.correctAnswer === option) {
      return 'right-answer'
    } else if (item.answerOption === option && item.answerOption !== item.correctAnswer) {
      return 'wrong-answer'
    }
    return 'white-background'
  }

  onSearch($event: Event) {
    const target = $event.target as HTMLInputElement;
    this.analyticsService.trackEvent(Events.SEARCH_INPUT, target.value, Events.SEARCH_INPUT)
    this.searchQuery$.next(target.value); // Update the search query
  }
}

type GroupedAccordionItems = {
  [key: string]: QuizQuestion[];
};
