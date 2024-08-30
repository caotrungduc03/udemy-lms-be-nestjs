import { IsEnum, IsNotEmpty } from 'class-validator';
import { QuestionTypeEnum } from 'src/enums';

export class CreateQuestionDto {
  @IsNotEmpty()
  questionTitle: string;

  @IsNotEmpty()
  @IsEnum(QuestionTypeEnum)
  questionType: string;

  @IsNotEmpty()
  answers: string[];

  @IsNotEmpty()
  correctAnswers: string[];

  @IsNotEmpty()
  exerciseId: number;
}
