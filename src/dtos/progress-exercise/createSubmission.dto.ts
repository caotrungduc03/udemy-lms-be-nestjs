export interface AnswerSubmission {
  questionId: number;
  answers: string[];
}

export class CreateSubmission {
  progressExerciseId: number;
  submission: AnswerSubmission[];
}
