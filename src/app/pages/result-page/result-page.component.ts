import { Component, HostListener, Directive, Renderer2, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ResultService } from '../../services/result.service';
import { AsyncPipe, CommonModule, NgFor } from '@angular/common';
import { QuizQuestion } from '../../domain/models';
import { AccordionDirective } from '../../directives/accordion.directive';
import {forkJoin, map, of, tap} from 'rxjs';
import { Router } from '@angular/router';
import {HeaderComponent} from "../../components/header/header.component";
import {ContainerComponent} from "../../components/container/container.component";
import {DividerComponent} from "../../components/divider/divider.component";
import {AnalyticsService} from "../../services/analytics.service";
import {Events} from "../../events";


@Component({
  selector: 'app-result-page',
  standalone: true,
  imports: [NgFor, AsyncPipe, AccordionDirective, CommonModule, HeaderComponent, ContainerComponent, DividerComponent],
  templateUrl: './result-page.component.html',
  styleUrl: './result-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class ResultPageComponent {

  public groupedAccordionItems$: any;
  public accordionItemKeys$: any;

  public truncateText(text: string): string {
    const isLaptop = window.innerWidth >= 768; // Example: Laptops typically have wider screens (> 768px)

    const adjustedMaxLength = isLaptop ? 125 : 50;

    return text.length > adjustedMaxLength
      ? text.substring(0, adjustedMaxLength) + '...'
      : text;
  }

  constructor(
    public readonly resultService: ResultService,
    public readonly router: Router,
    private readonly  analyticsService :AnalyticsService

  ) {
    this.groupedAccordionItems$ = this.resultService.getData().pipe(
      map(val => {
        return val.reduce((acc: GroupedAccordionItems, obj) => {
          const q = obj as QuizQuestion;
          const key = q.part;
          q.expanded = false
          if (!acc[key]) {
            acc[key] = [];
          }

          acc[key].push(q);
          return acc;
        }, {});

      })
    )

    this.accordionItemKeys$ = this.groupedAccordionItems$.pipe(
      map((obj: QuizQuestion) => Object.keys(obj))
    )

    this.sendAnalyticsEvent();

  }

  public checkForAnswer(option: string, item: QuizQuestion) {
    if (item.correctAnswer === option) {
      return 'right-answer'
    } else if (item.answerOption === option && item.answerOption !== item.correctAnswer) {
      return 'wrong-answer'
    }
    return 'white-background'
  }

  public getRightAnswerCount() {
    return  this.groupedAccordionItems$.pipe(
      map((val : any)=> {
        let count = 0;
        for (const key in val) {
          if (val.hasOwnProperty(key)) {
            const array = val[key];
            for (const item of array) {
              if (item.status === 'correct') {
                count++;
              }
            }
          }
        }
        return count;
      })
    )

  }

  public getWrongAnswerCount() {
   return  this.groupedAccordionItems$.pipe(
      map((val : any)=> {
        let count = 0;
        for (const key in val) {
          if (val.hasOwnProperty(key)) {
            const array = val[key];
            for (const item of array) {
              if (item.status === 'wrong') {
                count++;
              }
            }
          }
        }
        return count;
      })
    )
  }

  getItemsForKey(key: string, groupedAccordionItems: any): any[] {
    return groupedAccordionItems[key] || [];
  }


  public navigateToHomePage(){
    this.router.navigate([''])
  }

  public navigateToRandomPage(){
    this.router.navigate(['test'])
  }

  public sendAnalyticsEvent() {
    forkJoin({
      rightCount: this.getRightAnswerCount(),
      wrongCount: this.getWrongAnswerCount()
    }).subscribe(({ rightCount, wrongCount }) => {
      const message = `Right: ${rightCount}, Wrong: ${wrongCount}`;
      this.analyticsService.trackEvent(Events.RESULT, message, Events.RESULT );
    });
  }
}



type GroupedAccordionItems = {
  [key: string]: QuizQuestion[];
};
