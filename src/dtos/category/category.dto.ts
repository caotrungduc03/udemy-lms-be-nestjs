import { Expose, Type } from 'class-transformer';
import { BaseDto } from 'src/common/base.dto';

export class CategoryDto extends BaseDto {
  @Expose()
  categoryName: string;

  @Expose()
  @Type(() => CategoryDto)
  parent: CategoryDto;

  @Expose()
  @Type(() => CategoryDto)
  children: CategoryDto[];
}
