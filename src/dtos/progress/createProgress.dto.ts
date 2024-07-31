import { IsEmpty, IsNotEmpty } from 'class-validator';

export class CreateProgressDto {
  @IsEmpty()
  userId: number;

  @IsNotEmpty()
  courseId: number;

  @IsEmpty()
  progressStatus: boolean;
}
