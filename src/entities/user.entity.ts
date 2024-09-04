import { CustomBaseEntity } from 'src/common/customBase.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CourseEntity } from './course.entity';
import { ProgressEntity } from './progress.entity';
import { RoleEntity } from './role.entity';

@Entity({ name: 'users' })
export class UserEntity extends CustomBaseEntity {
  @Column({
    name: 'full_name',
  })
  fullName: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({
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
    default: true,
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
  })
  roleId: number;

  @ManyToOne(() => RoleEntity, (role: RoleEntity) => role.users)
  @JoinColumn({
    name: 'role_id',
  })
  role: RoleEntity;

  @OneToMany(() => CourseEntity, (course: CourseEntity) => course.author)
  author: CourseEntity[];

  @OneToMany(() => ProgressEntity, (progress: ProgressEntity) => progress.user)
  progress: ProgressEntity[];
}
