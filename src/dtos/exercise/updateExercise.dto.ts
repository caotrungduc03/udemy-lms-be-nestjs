import { IsNotEmpty } from 'class-validator';

export class UpdateExerciseDto {
  @IsNotEmpty()
  exerciseName: string;

  @IsNotEmpty()
  exerciseType: string;

  description: string;

  @IsNotEmpty()
  duration: number;

  @IsNotEmpty()
  deadline: string;

  @IsNotEmpty()
  min_passing_score: number;

  @IsNotEmpty()
  max_tries: number;
}
