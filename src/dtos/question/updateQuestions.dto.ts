import { Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { UpdateQuestionDto } from './updateQuestion.dto';

export class UpdateQuestionWithId extends UpdateQuestionDto {
  @IsNumber()
  id: number;
}

export class UpdateQuestionsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateQuestionWithId)
  questions: UpdateQuestionWithId[];
}
