import { Exclude, Expose, Transform } from 'class-transformer';
import { BaseDto } from 'src/common/base.dto';
import { ProgressExerciseEntity, ProgressLessonsEntity } from 'src/entities';
import { CourseDto } from '../course/course.dto';
import { UserDto } from '../user/user.dto';

export class ProgressDto extends BaseDto {
  @Exclude()
  userId: number;

  @Expose()
  @Transform(({ obj }) => UserDto.plainToInstance(obj?.user))
  user: UserDto;

  @Exclude()
  courseId: number;

  @Expose({ groups: ['student'] })
  @Transform(({ obj }) => CourseDto.plainToInstance(obj?.course))
  course: CourseDto;

  @Expose()
  @Transform(({ obj }) => {
    return (
      obj?.progressLessons?.map(
        (progressLesson: ProgressLessonsEntity) => progressLesson.lessonId,
      ) || []
    );
  })
  progressLessons: number[];

  @Expose()
  @Transform(({ obj }) => {
    return (
      obj?.progressExercises?.map(
        (progressExercise: ProgressExerciseEntity) =>
          progressExercise.progressId,
      ) || []
    );
  })
  progressExercises: number[];
}
