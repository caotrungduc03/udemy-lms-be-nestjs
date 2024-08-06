import { Expose, Transform, Type } from 'class-transformer';
import { format } from 'date-fns';
import { BaseDto } from 'src/common/base.dto';
import { CategoryDto } from '../category/category.dto';
import { ExerciseDto } from '../exercise/exercise.dto';
import { LessonDto } from '../lesson/lesson.dto';
import { UserDto } from '../user/user.dto';

export class CourseDto extends BaseDto {
  @Expose()
  courseName: string;

  @Expose()
  description: string;

  @Expose()
  coverImage: string;

  @Expose()
  priceType: string;

  @Expose()
  price: number;

  @Expose()
  language: string;

  @Expose()
  @Transform(({ obj }) => format(obj.updatedAt, 'dd/MM/yyyy'))
  lastUpdate: string;

  @Expose()
  @Type(() => UserDto)
  author: UserDto;

  @Expose()
  @Type(() => CategoryDto)
  category: CategoryDto;

  @Expose()
  @Type(() => LessonDto)
  lessons: LessonDto[];

  @Expose()
  @Type(() => ExerciseDto)
  exercises: ExerciseDto[];
}
