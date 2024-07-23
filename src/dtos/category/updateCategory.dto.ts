import { IsNotEmpty, MinLength } from 'class-validator';

export class UpdateCategoryDto {
  @IsNotEmpty()
  @MinLength(3)
  categoryName: string;

  parentId: number | null;
}
