import { GradingStatusEnum } from 'src/enums';
import { SubmissionDto } from './submission.dto';

export interface AnswerDetail {
  questionId: number;
  questionTitle: string;
  questionType: string;
  correctAnswers: string[];
  answers: string[];
  point: number;
  gradingStatus: GradingStatusEnum;
}

export class GetSubmissionDetailResponseDto {
  submission: SubmissionDto;
  answerDetails: AnswerDetail[];
}
