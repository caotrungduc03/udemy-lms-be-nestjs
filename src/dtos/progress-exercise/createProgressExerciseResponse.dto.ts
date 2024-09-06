import { QuestionDto } from '../question/question.dto';

export class CreateProgressExerciseResponseDto {
  id: number;
  tryCount: number;
  questions: QuestionDto[];
}
