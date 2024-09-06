import { Type } from 'class-transformer';
import { IsEmpty, IsEnum, IsNotEmpty, Min, MinLength } from 'class-validator';
import { BaseRequestDto } from 'src/common/baseRequest.dto';
import { PriceTypeEnum } from 'src/enums';

export class CreateCourseDto extends BaseRequestDto {
  @IsNotEmpty()
  @MinLength(3)
  courseName: string;

  description: string;

  @IsEmpty()
  coverImage: string;

  @IsNotEmpty()
  @IsEnum(PriceTypeEnum)
  priceType: string;

  @IsNotEmpty()
  @Type(() => Number)
  @Min(0)
  price: number;

  @IsNotEmpty()
  language: string;

  @IsEmpty()
  authorId: number;

  @IsNotEmpty()
  @Type(() => Number)
  categoryId: number;
}
