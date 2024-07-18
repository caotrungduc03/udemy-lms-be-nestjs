import { Expose } from 'class-transformer';
import { BaseDto } from 'src/common/base.dto';

export class UserDto extends BaseDto {
  @Expose()
  fullName: string;

  @Expose()
  email: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  avatar: string;

  @Expose()
  roleId: string;

  @Expose()
  status: boolean;

  @Expose()
  lastLogin: Date;
}
