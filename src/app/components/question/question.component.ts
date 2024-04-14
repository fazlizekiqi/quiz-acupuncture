
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, input } from '@angular/core';
import { QuizQuestion } from '../../domain/models';
import { JsonPipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [NgIf, JsonPipe, NgFor],
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
  public alternatives?: { value: string, label: string, fakeLabel?: string }[]

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
      this.alternatives = this.shuffleAlternatives()
      if (q.answerOption) {
        this.selectedAnswer = q.answerOption
      }

    }
  }

  shuffleAlternatives() {
    const labels = ['A', 'B', 'C', 'D'];

    const shuffledLabels = labels.sort(() => Math.random() - 0.5);
    const alternatives = [
      { label: 'A', value: this.question?.A ?? '', fakeLabel: shuffledLabels[0] },
      { label: 'B', value: this.question?.B ?? '', fakeLabel: shuffledLabels[1] },
      { label: 'C', value: this.question?.C ?? '', fakeLabel: shuffledLabels[2] },
      { label: 'D', value: this.question?.D ?? '', fakeLabel: shuffledLabels[3] }
    ].sort((a, b) => a.fakeLabel > b.fakeLabel ? 1 : -1);
    this.alternatives = alternatives;
    return alternatives;
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
