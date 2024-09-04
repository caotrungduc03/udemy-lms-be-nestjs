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
  minPassingPercentage: number;

  @IsNotEmpty()
  maxTries: number;

  @IsNotEmpty()
  courseId: number;
}
