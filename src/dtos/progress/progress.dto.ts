import { Exclude, Expose, Transform } from 'class-transformer';
import { BaseDto } from 'src/common/base.dto';
import { CourseDto } from '../course/course.dto';
import { UserDto } from '../user/user.dto';

export class ProgressDto extends BaseDto {
  @Expose()
  status: boolean;

  @Exclude()
  userId: number;

  @Expose()
  @Transform(({ obj }) => UserDto.plainToInstance(obj?.user))
  user: UserDto;

  @Exclude()
  courseId: number;

  @Expose()
  @Transform(({ obj }) => {
    if (!obj?.course) return undefined;

    const { lessons, exercises, ...rest } = obj.course;
    return CourseDto.plainToInstance(rest);
  })
  course: CourseDto;

  progressLessonIds: number[];

  progressExerciseIds: number[];

  percentage: number;
}
