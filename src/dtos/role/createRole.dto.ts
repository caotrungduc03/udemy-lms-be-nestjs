import { IsNotEmpty } from 'class-validator';
import { BaseRequestDto } from 'src/common/baseRequest.dto';

export class CreateRoleDto extends BaseRequestDto {
  @IsNotEmpty()
  roleName: string;
}
