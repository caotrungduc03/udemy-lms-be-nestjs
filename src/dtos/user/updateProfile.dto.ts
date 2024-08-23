import { IsEmpty, IsNotEmpty, MinLength } from 'class-validator';
import { BaseRequestDto } from 'src/common/baseRequest.dto';

export class UpdateProfileDto extends BaseRequestDto {
  @IsNotEmpty()
  @MinLength(3)
  fullName: string;

  phoneNumber: string;

  @IsEmpty()
  avatar: string;
}
