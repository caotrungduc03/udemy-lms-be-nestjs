import { IsNotEmpty, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @IsNotEmpty()
  @MinLength(3)
  fullName: string;

  phoneNumber: string;

  avatar: string;
}
