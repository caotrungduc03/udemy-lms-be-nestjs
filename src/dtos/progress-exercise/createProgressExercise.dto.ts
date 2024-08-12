import { IsNotEmpty } from 'class-validator';

export class CreateProgressExerciseDto {
  @IsNotEmpty()
  progressId: number;

  @IsNotEmpty()
  exerciseId: number;
}
