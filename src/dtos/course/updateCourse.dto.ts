import { IsEmpty, IsEnum, IsNotEmpty, Min, MinLength } from 'class-validator';

export class UpdateCourseDto {
  @IsNotEmpty()
  @MinLength(3)
  courseName: string;

  description: string;

  coverImage: string;

  @IsNotEmpty()
  @IsEnum(['free', 'paid'], {
    message: 'Price type must be free or paid',
  })
  priceType: string;

  @IsNotEmpty()
  @Min(0)
  price: number;

  language: string;

  @IsEmpty()
  authorId: number;
}
