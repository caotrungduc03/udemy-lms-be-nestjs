import { IsNotEmpty } from 'class-validator';
import { BaseRequestDto } from 'src/common/baseRequest.dto';

export class CreateProgressExerciseRequestDto extends BaseRequestDto {
  @IsNotEmpty()
  progressId: number;

  @IsNotEmpty()
  exerciseId: number;
}
