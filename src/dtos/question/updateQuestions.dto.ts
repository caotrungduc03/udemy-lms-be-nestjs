import { Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { BaseRequestDto } from 'src/common/baseRequest.dto';
import { UpdateQuestionDto } from './updateQuestion.dto';

export class UpdateQuestionWithId extends UpdateQuestionDto {
  @IsNumber()
  id: number;
}

export class UpdateQuestionsDto extends BaseRequestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateQuestionWithId)
  questions: UpdateQuestionWithId[];
}
