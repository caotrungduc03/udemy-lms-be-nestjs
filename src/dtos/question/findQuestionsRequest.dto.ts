import { IsNotEmpty } from 'class-validator';
import { BaseRequestDto } from 'src/common/baseRequest.dto';

export class FindQuestionsRequestDto extends BaseRequestDto {
  @IsNotEmpty()
  exerciseId: string;
}
