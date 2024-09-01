import { Expose, Transform } from 'class-transformer';
import { format } from 'date-fns';
import { BaseDto } from 'src/common/base.dto';

export class ExerciseDto extends BaseDto {
  @Expose()
  exerciseName: string;

  @Expose()
  description: string;

  @Expose()
  exerciseType: string;

  @Expose()
  duration: number;

  @Expose()
  @Transform(({ obj }) => format(obj.deadline, 'MM-dd-yyyy'))
  deadline: string;

  @Expose()
  min_passing_percentage: number;

  @Expose()
  max_tries: number;

  @Expose()
  courseId: number;

  @Expose()
  @Transform(({ obj }) => obj.questions?.length || 0)
  totalQuestions: number;
}
