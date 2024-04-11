export interface QuizQuestion {
  part: string;
  questionNumber: string;
  question: string;
  A: string;
  B: string;
  C: string;
  D: string;
  answerOption?: string;
  answerText?: string;
  correctAnswer?: string;
  expanded?: boolean;
  status?: 'unanswered' | 'correct' | 'wrong';

}


