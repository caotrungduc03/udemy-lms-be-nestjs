import { Expose, Type } from 'class-transformer';
import { BaseDto } from 'src/common/base.dto';
import { CategoryDto } from '../category/category.dto';
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
  @Type(() => UserDto)
  author: UserDto;

  @Expose()
  @Type(() => CategoryDto)
  category: CategoryDto;
}
