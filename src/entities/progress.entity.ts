import { CustomBaseEntity } from 'src/common/customBase.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { CourseEntity } from './course.entity';
import { ProgressExerciseEntity } from './progressExercise.entity';
import { ProgressLessonsEntity } from './progressLessons.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'progress' })
@Unique(['userId', 'courseId'])
export class ProgressEntity extends CustomBaseEntity {
  @Column({
    type: 'boolean',
    default: true,
  })
  status: boolean;

  @Column({
    name: 'user_id',
  })
  userId: number;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.progress)
  @JoinColumn({
    name: 'user_id',
  })
  user: UserEntity;

  @Column({
    name: 'course_id',
  })
  courseId: number;

  @ManyToOne(() => CourseEntity, (course: CourseEntity) => course.progress)
  @JoinColumn({
    name: 'course_id',
  })
  course: CourseEntity;

  @OneToMany(
    () => ProgressLessonsEntity,
    (progressLessons: ProgressLessonsEntity) => progressLessons.progress,
  )
  progressLessons: ProgressLessonsEntity[];

  @OneToMany(
    () => ProgressExerciseEntity,
    (progressExercises: ProgressExerciseEntity) => progressExercises.progress,
  )
  progressExercises: ProgressExerciseEntity[];
}
