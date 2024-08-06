import { IsNotEmpty } from 'class-validator';

export class UpdateQuestionDto {
  @IsNotEmpty()
  questionTitle: string;

  @IsNotEmpty()
  questionType: string;

  @IsNotEmpty()
  answers: string[];

  @IsNotEmpty()
  correctAnswers: string[];
}
