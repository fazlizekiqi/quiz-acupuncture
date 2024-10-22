
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

    const alternatives = [
      { label: 'A', value: this.question?.A ?? '' },
      { label: 'B', value: this.question?.B ?? '' },
      { label: 'C', value: this.question?.C ?? '' },
      { label: 'D', value: this.question?.D ?? '' }
    ].filter(alternative => alternative.value); // Filter out alternatives with empty values

    // Shuffle the remaining alternatives
    const shuffledAlternatives = alternatives.sort(() => Math.random() - 0.5);

    // Get the number of valid alternatives to determine the labels
    const validCount = shuffledAlternatives.length;

    // Map the shuffled alternatives to include only as many labels as there are valid alternatives
    const finalAlternatives = shuffledAlternatives.map((alternative, index) => ({
      ...alternative,
      fakeLabel: labels[index] // Assign label based on the index
    })).slice(0, validCount); // Ensure we only return as many alternatives as we have

    // Return the final alternatives
    this.alternatives = finalAlternatives;
    return finalAlternatives;
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


  getFormattedPart(otherPart: string | undefined) {
    if(otherPart){
      const infoMatch = otherPart.match(/info::(.*?)::info/);
      let extractedInfo = null;

      // If a match is found, extract it and remove from otherPart
      if (infoMatch) {
        extractedInfo = infoMatch[1].trim(); // Get the text inside
        // Remove the info text from otherPart
        otherPart = otherPart.replace(infoMatch[0], '').trim();
        return otherPart
      }
    }
    return otherPart;
  }
}
