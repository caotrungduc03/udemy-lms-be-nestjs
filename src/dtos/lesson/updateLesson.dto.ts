import { IsNotEmpty } from 'class-validator';

export class UpdateLessonDto {
  @IsNotEmpty()
  lessonName: string;

  description: string;

  @IsNotEmpty()
  duration: number;

  @IsNotEmpty()
  content: string;
}
