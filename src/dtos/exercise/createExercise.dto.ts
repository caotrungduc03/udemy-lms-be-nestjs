import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  Max,
  Min,
} from 'class-validator';
import { ExerciseTypeEnum } from 'src/enums';

export class CreateExerciseDto {
  @IsNotEmpty()
  exerciseName: string;

  description: string;

  @IsNotEmpty()
  @IsEnum(ExerciseTypeEnum)
  exerciseType: string;

  @IsPositive()
  duration: number;

  deadline: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  minPassingPercentage: number;

  @IsNumber()
  maxTries: number;

  @IsNumber()
  courseId: number;
}
