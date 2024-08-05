import { Expose } from 'class-transformer';
import { BaseDto } from 'src/common/base.dto';

export class ProgressLessonsDto extends BaseDto {
  @Expose()
  progressId: number;

  @Expose()
  lessonId: number;
}
