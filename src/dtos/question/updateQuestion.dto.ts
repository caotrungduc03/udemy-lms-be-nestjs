import { IsArray, IsEnum, IsNotEmpty } from 'class-validator';
import { QuestionTypeEnum } from 'src/enums';

export class UpdateQuestionDto {
  @IsNotEmpty()
  questionTitle: string;

  @IsEnum(QuestionTypeEnum)
  questionType: string;

  @IsArray()
  answers: string[];

  @IsArray()
  correctAnswers: string[];

  @IsNotEmpty()
  maxPoint: number;
}
