import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { BaseDto } from 'src/common/base.dto';
import { CourseDto } from '../course/course.dto';
import { UserDto } from '../user/user.dto';

export class ProgressDto extends BaseDto {
  @Exclude()
  progressStatus: boolean;

  @Exclude()
  userId: number;

  @Expose()
  @Transform(({ obj }) => UserDto.plainToInstance(obj?.user))
  user: UserDto;

  @Exclude()
  @Type(() => CourseDto)
  courseId: number;

  @Expose({ groups: ['student'] })
  @Transform(({ obj }) => CourseDto.plainToInstance(obj?.course))
  course: CourseDto;
}
