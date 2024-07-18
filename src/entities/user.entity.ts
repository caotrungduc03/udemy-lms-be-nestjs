import { CustomBaseEntity } from 'src/common/customBase.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { RoleEntity } from './role.entity';

@Entity({ name: 'users' })
export class UserEntity extends CustomBaseEntity {
  @Column({
    name: 'full_name',
    nullable: false,
  })
  fullName: string;

  @Column({
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    nullable: false,
    select: false,
  })
  password: string;

  @Column({
    name: 'phone_number',
    nullable: true,
  })
  phoneNumber: string;

  @Column({
    nullable: true,
  })
  avatar: string;

  @Column({
    default: false,
  })
  status: boolean;

  @Column({
    name: 'last_login',
    type: 'timestamptz',
    nullable: true,
  })
  lastLogin: Date;

  @Column({
    name: 'role_id',
    nullable: false,
  })
  roleId: number;

  @ManyToOne(() => RoleEntity, (role: RoleEntity) => role.users, {
    eager: true,
  })
  @JoinColumn({
    name: 'role_id',
  })
  role: RoleEntity;
}
