import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { BaseDto } from 'src/common/base.dto';

export class CategoryDto extends BaseDto {
  @Expose()
  categoryName: string;

  @Exclude()
  @Type(() => CategoryDto)
  parent: CategoryDto;

  @Expose()
  @Transform(({ obj }) => obj?.parent?.categoryName || null)
  parentName: string;

  @Exclude()
  @Type(() => CategoryDto)
  children: CategoryDto[];

  @Expose()
  @Transform(({ obj }) => obj?.children?.map(({ categoryName }) => categoryName) || null)
  childrenNames: string[];
}
