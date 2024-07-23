import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { BaseDto } from 'src/common/base.dto';
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

  @Exclude()
  @Type(() => UserDto)
  author: UserDto;

  @Expose()
  @Transform(({ obj }) => obj?.author?.fullName)
  authorName: string;
}
