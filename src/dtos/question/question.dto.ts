import { Expose, Type } from 'class-transformer';
import { BaseDto } from 'src/common/base.dto';
import { ExerciseDto } from '../exercise/exercise.dto';

export class QuestionDto extends BaseDto {
  @Expose()
  questionTitle: string;

  @Expose()
  questionType: string;

  @Expose()
  answers: string[];

  @Expose()
  correctAnswers: string[];

  @Expose()
  @Type(() => ExerciseDto)
  exercise: ExerciseDto;
}
