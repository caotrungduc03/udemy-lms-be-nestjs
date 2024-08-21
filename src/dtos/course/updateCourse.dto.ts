import { Type } from 'class-transformer';
import { IsEmpty, IsEnum, IsNotEmpty, Min, MinLength } from 'class-validator';
import { BaseRequestDto } from 'src/common/baseRequest.dto';

export class UpdateCourseDto extends BaseRequestDto {
  @IsNotEmpty()
  @MinLength(3)
  courseName: string;

  description: string;

  @IsEmpty()
  coverImage: string;

  @IsNotEmpty()
  @IsEnum(['free', 'paid'], {
    message: 'Price type must be free or paid',
  })
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
  categoryId: number;
}
