import { Expose } from 'class-transformer';
import { BaseDto } from 'src/common/base.dto';

export class RoleDto extends BaseDto {
  @Expose()
  roleName: string;
}
