import { IsNotEmpty } from 'class-validator';
import { BaseRequestDto } from 'src/common/baseRequest.dto';

export class FindExercisesRequestDto extends BaseRequestDto {
  @IsNotEmpty()
  courseId: string;
}
