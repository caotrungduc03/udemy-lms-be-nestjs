import { CustomBaseEntity } from 'src/common/customBase.entity';
import { BeforeUpdate, Column, Entity } from 'typeorm';

@Entity({
  name: 'roles',
})
export class RoleEntity extends CustomBaseEntity {
  @Column({
    name: 'role_name',
    unique: true,
  })
  roleName: string;

  @BeforeUpdate()
  upperCase() {
    this.roleName = this.roleName.trim().toUpperCase();
  }
}
