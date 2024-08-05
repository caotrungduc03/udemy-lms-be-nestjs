import { IsNotEmpty } from 'class-validator';

export class CreateProgressLessonsDto {
  @IsNotEmpty()
  lessonId: number;

  @IsNotEmpty()
  progressId: number;
}
