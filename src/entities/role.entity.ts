import { CustomBaseEntity } from 'src/common/customBase.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({
  name: 'roles',
})
export class RoleEntity extends CustomBaseEntity {
  @Column({
    name: 'role_name',
    unique: true,
  })
  roleName: string;

  @OneToMany(() => UserEntity, (user: UserEntity) => user.role)
  users: UserEntity[];
}
