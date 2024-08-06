import { IsNotEmpty } from 'class-validator';

export class CreateQuestionDto {
  @IsNotEmpty()
  questionTitle: string;

  @IsNotEmpty()
  questionType: string;

  @IsNotEmpty()
  answers: string[];

  @IsNotEmpty()
  correctAnswers: string[];

  @IsNotEmpty()
  exerciseId: number;
}
