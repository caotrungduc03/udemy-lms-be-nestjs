import { Exclude, Expose, Type } from 'class-transformer';
import { BaseDto } from 'src/common/base.dto';
import { CourseDto } from '../course/course.dto';

export class LessonDto extends BaseDto {
  @Expose()
  lessonName: string;

  @Expose({
    groups: ['detail'],
  })
  description: string;

  @Expose()
  duration: number;

  @Expose({
    groups: ['detail'],
  })
  content: string;

  @Exclude()
  courseId: number;

  @Expose()
  @Type(() => CourseDto)
  course: CourseDto;
}
