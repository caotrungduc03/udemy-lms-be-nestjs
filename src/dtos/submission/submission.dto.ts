import { SubmissionStatusEnum } from 'src/enums';

export class SubmissionDto {
  progressExerciseId: number;
  tryCount: number;
  totalQuestions: number;
  numberOfCorrectAnswers: number;
  numberOfIncorrectAnswers: number;
  numberOfPendingAnswers: number;
  totalPointQuestions: number;
  gainedPointQuestions: number;
  percentage: number;
  status: SubmissionStatusEnum;
  date: string;
}
