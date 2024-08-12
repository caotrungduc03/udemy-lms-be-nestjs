import { Expose } from 'class-transformer';
import { BaseDto } from 'src/common/base.dto';

export class ProgressExerciseDto extends BaseDto {
  @Expose()
  tryCount: number;
}
