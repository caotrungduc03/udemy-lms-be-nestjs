import { CustomBaseEntity } from 'src/common/customBase.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CourseEntity } from './course.entity';

@Entity({ name: 'lessons' })
export class LessonEntity extends CustomBaseEntity {
  @Column({
    name: 'lesson_name',
  })
  lessonName: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({})
  duration: number;

  @Column({
    type: 'text',
  })
  content: string;

  @Column({
    name: 'course_id',
  })
  courseId: number;

  @ManyToOne(() => CourseEntity, (course: CourseEntity) => course.lessons)
  @JoinColumn({
    name: 'course_id',
  })
  course: CourseEntity;
}
