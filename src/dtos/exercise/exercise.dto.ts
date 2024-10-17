import { Expose, Transform } from 'class-transformer';
import { format } from 'date-fns';
import { BaseDto } from 'src/common/base.dto';

export class ExerciseDto extends BaseDto {
  @Expose()
  exerciseName: string;

  @Expose({
    groups: ['detail'],
  })
  description: string;

  @Expose()
  exerciseType: string;

  @Expose()
  duration: number;

  @Expose()
  @Transform(({ obj }) => format(obj.deadline, 'MM-dd-yyyy'))
  deadline: string;

  @Expose()
  minPassingPercentage: number;

  @Expose()
  maxTries: number;

  @Expose()
  courseId: number;

  @Expose()
  @Transform(({ obj }) => obj.questions?.length || 0)
  totalQuestions: number;
}
