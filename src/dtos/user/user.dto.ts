import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { BaseDto } from 'src/common/base.dto';
import { RoleDto } from '../role/role.dto';

export class UserDto extends BaseDto {
  @Expose()
  fullName: string;

  @Expose()
  email: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  avatar: string;

  @Exclude()
  roleId: number;

  @Expose()
  status: boolean;

  @Expose()
  lastLogin: Date;

  @Exclude()
  @Type(() => RoleDto)
  role: RoleDto;

  @Expose()
  @Transform(({ obj }) => obj?.role?.roleName)
  roleName: string;
}
