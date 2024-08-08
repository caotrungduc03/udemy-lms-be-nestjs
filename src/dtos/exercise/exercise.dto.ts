import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { format } from 'date-fns';
import { BaseDto } from 'src/common/base.dto';
import { CourseDto } from '../course/course.dto';
import { QuestionDto } from '../question/question.dto';

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
  min_passing_score: number;

  @Expose()
  max_tries: number;

  @Exclude()
  courseId: number;

  @Expose()
  @Type(() => CourseDto)
  course: CourseDto;

  @Expose()
  @Type(() => QuestionDto)
  questions: QuestionDto[];
}
