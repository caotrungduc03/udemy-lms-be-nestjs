import { Exclude, Expose, Type } from 'class-transformer';
import { BaseDto } from 'src/common/base.dto';
import { RoleDto } from '../role/role.dto';

export class UserDto extends BaseDto {
  @Expose()
  fullName: string;

  @Expose({
    groups: ['private', 'admin'],
  })
  email: string;

  @Expose({
    groups: ['private', 'admin'],
  })
  phoneNumber: string;

  @Expose()
  avatar: string;

  @Exclude()
  roleId: number;

  @Expose({
    groups: ['admin'],
  })
  status: boolean;

  @Expose({
    groups: ['admin'],
  })
  lastLogin: Date;

  @Expose({
    groups: ['private', 'admin'],
  })
  @Type(() => RoleDto)
  role: RoleDto;
}
