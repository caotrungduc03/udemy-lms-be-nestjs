import { IsNotEmpty, Max, Min } from 'class-validator';

export class CreateExerciseDto {
  @IsNotEmpty()
  exerciseName: string;

  description: string;

  @IsNotEmpty()
  exerciseType: string;

  @IsNotEmpty()
  duration: number;

  deadline: string;

  @IsNotEmpty()
  @Min(0)
  @Max(100)
  minPassingPercentage: number;

  @IsNotEmpty()
  maxTries: number;

  @IsNotEmpty()
  courseId: number;
}
