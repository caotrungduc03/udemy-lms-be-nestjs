import { CustomBaseEntity } from 'src/common/customBase.entity';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { CourseEntity } from './course.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'progress' })
@Unique(['userId', 'courseId'])
export class ProgressEntity extends CustomBaseEntity {
  @Column({
    name: 'progress_status',
    default: true,
  })
  progressStatus: boolean;

  @Column({
    name: 'user_id',
    nullable: false,
  })
  userId: number;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.progress)
  @JoinColumn({
    name: 'user_id',
  })
  user: UserEntity;

  @Column({
    name: 'course_id',
    nullable: false,
  })
  courseId: number;

  @ManyToOne(() => CourseEntity, (course: CourseEntity) => course.progress)
  @JoinColumn({
    name: 'course_id',
  })
  course: CourseEntity;
}
