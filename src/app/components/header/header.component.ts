import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  public questionType: string | undefined;
  @Input() showBackButton: boolean = true
  @Input() goBackDestination: string = ''

  constructor(private readonly router:Router) {
    const previousPath = localStorage.getItem('lastPath');
    if(previousPath){
      this.questionType = `${previousPath} questions`
    }
  }

  goToChooseQuestionTypePage() {
    localStorage.clear()
    this.router.navigate([this.goBackDestination])
  }
}
