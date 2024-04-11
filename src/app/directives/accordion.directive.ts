import { HostListener, Directive, ElementRef } from '@angular/core';

@Directive({ selector: '[accordion]', standalone: true })
export class AccordionDirective {

  constructor(private el: ElementRef) {
  }

  @HostListener('click', ['$event']) onClick($event: any) {
    this.el.nativeElement.classList.toggle('is-open');
    const content = this.el.nativeElement.nextElementSibling;
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";

    }
  }
}