import { CustomBaseEntity } from 'src/common/customBase.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CourseEntity } from './course.entity';

@Entity({ name: 'lessons' })
export class LessonEntity extends CustomBaseEntity {
  @Column({
    name: 'lesson_name',
    nullable: false,
  })
  lessonName: string;

  @Column({
    name: 'description',
  })
  description: string;

  @Column({
    nullable: false,
  })
  duration: number;

  @Column({
    type: 'text',
    nullable: false,
  })
  content: string;

  @Column({
    name: 'course_id',
    nullable: false,
  })
  courseId: number;

  @ManyToOne(() => CourseEntity, (course: CourseEntity) => course.lessons)
  @JoinColumn({
    name: 'course_id',
  })
  course: CourseEntity;
}
