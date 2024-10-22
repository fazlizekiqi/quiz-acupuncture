import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  public questionType: string | undefined;

  constructor(private readonly router:Router) {
    const previousPath = localStorage.getItem('lastPath');
    if(previousPath){
      this.questionType = `${previousPath} questions`
    }
  }

  goToChooseQuestionTypePage() {
    localStorage.clear()
    this.router.navigate([''])
  }
}
