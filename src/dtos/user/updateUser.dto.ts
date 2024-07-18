import { IsNotEmpty, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @MinLength(3)
  fullName: string;

  phoneNumber: string;

  avatar: string;

  roleId: number;

  status: boolean;
}
