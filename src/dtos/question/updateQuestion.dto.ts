import { IsEnum, IsNotEmpty } from 'class-validator';
import { QuestionTypeEnum } from 'src/enums';

export class UpdateQuestionDto {
  @IsNotEmpty()
  questionTitle: string;

  @IsEnum(QuestionTypeEnum)
  questionType: string;

  @IsNotEmpty()
  answers: string[];

  @IsNotEmpty()
  correctAnswers: string[];
}
