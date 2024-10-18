import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { QuestionTypeEnum } from 'src/enums';

export class QuestionRequestDto {
  @IsNotEmpty()
  questionTitle: string;

  @IsEnum(QuestionTypeEnum)
  questionType: string;

  @IsArray()
  answers: string[];

  @IsArray()
  correctAnswers: string[];

  @IsNumber()
  maxPoint: number;
}

export class CreateQuestionDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionRequestDto)
  questions: QuestionRequestDto[];

  @IsNumber()
  exerciseId: number;
}
