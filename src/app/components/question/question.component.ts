
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, input } from '@angular/core';
import { QuizQuestion } from '../../domain/models';
import { JsonPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [NgIf, JsonPipe],
  templateUrl: './question.component.html',
  styleUrl: './question.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionComponent {

  public question?: QuizQuestion;
  public selectedAnswer: string = '';
  public showResult = false;
  public optionsDisabled: { disabled: boolean } = { disabled: false };
  public revealAnswerFlag = { reveal: false };

  @Input()
  public showNextButton = true;

  @Input()
  public type: "train" | "test" = "train"

  @Input()
  public set showResultButton(result: { showResult: boolean }) {
    if (result) {
      this.showResult = result.showResult;
    }
  }

  @Input()
  public set qs(q: any) {
    if (q) {
      this.question = q;
      if (q.answerOption) {
        this.selectedAnswer = q.answerOption
      }

    }
  }

  @Input()
  public set answeredQuestion(selectedAnswer: string) {
    if (selectedAnswer) {
      this.selectedAnswer = selectedAnswer
    }
  }

  @Output()
  public optionSelected = new EventEmitter<QuizQuestion>()

  @Output()
  public nextClick = new EventEmitter<QuizQuestion>()

  @Output()
  public prevClick = new EventEmitter<void>()

  selectAnswer(selectedOption: string) {
    this.selectedAnswer = selectedOption;
    this.revealAnswer()
  }

  revealAnswer() {
    if (!this.optionsDisabled.disabled) {

      this.optionsDisabled = { disabled: true }
      this.revealAnswerFlag = { reveal: true }
      if (this.question) {
        this.question = { ...this.question, answerOption: this.selectedAnswer }
      }
      
   
      // Might need to do something
    }
  }

  goToNextQuestion() {
    if (this.question && this.selectedAnswer in this.question) {
      const selectedAnswer = this.selectedAnswer as keyof QuizQuestion;
      const answerText = this.question[selectedAnswer];
      this.nextClick.next({ ...this.question, answerOption: this.selectedAnswer, answerText } as QuizQuestion)
      this.optionsDisabled = { disabled: false }
      this.selectedAnswer = '';
      this.revealAnswerFlag = { reveal: false }

    }
  }

  goToPreviousQuestion() {
    this.prevClick.next()
  }


}
