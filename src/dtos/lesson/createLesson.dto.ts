import { IsNotEmpty } from 'class-validator';

export class CreateLessonDto {
  @IsNotEmpty()
  lessonName: string;

  description: string;

  @IsNotEmpty()
  duration: number;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  courseId: number;
}
