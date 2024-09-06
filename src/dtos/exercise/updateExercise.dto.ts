import { IsNotEmpty, Max, Min } from 'class-validator';

export class UpdateExerciseDto {
  @IsNotEmpty()
  exerciseName: string;

  @IsNotEmpty()
  exerciseType: string;

  description: string;

  @IsNotEmpty()
  duration: number;

  deadline: string;

  @IsNotEmpty()
  @Min(0)
  @Max(100)
  minPassingPercentage: number;

  @IsNotEmpty()
  maxTries: number;
}
