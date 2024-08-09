import { IsNotEmpty } from 'class-validator';

export class CreateExerciseDto {
  @IsNotEmpty()
  exerciseName: string;

  description: string;

  @IsNotEmpty()
  exerciseType: string;

  @IsNotEmpty()
  duration: number;

  @IsNotEmpty()
  deadline: string;

  @IsNotEmpty()
  min_passing_percentage: number;

  @IsNotEmpty()
  max_tries: number;

  @IsNotEmpty()
  courseId: number;
}
