import { Type } from 'class-transformer';
import { IsEmpty, IsNotEmpty, MinLength } from 'class-validator';
import { BaseRequestDto } from 'src/common/baseRequest.dto';

export class UpdateUserDto extends BaseRequestDto {
  @IsNotEmpty()
  @MinLength(3)
  fullName: string;

  phoneNumber: string;

  @IsEmpty()
  avatar: string;

  @Type(() => Number)
  roleId: number;
}
