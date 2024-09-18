import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  Max,
  Min,
} from 'class-validator';
import { ExerciseTypeEnum } from 'src/enums';

export class UpdateExerciseDto {
  @IsOptional()
  @IsNotEmpty()
  exerciseName: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(ExerciseTypeEnum)
  exerciseType: string;

  description: string;

  @IsOptional()
  @IsPositive()
  duration: number;

  deadline: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  minPassingPercentage: number;

  @IsOptional()
  @IsNumber()
  maxTries: number;
}
