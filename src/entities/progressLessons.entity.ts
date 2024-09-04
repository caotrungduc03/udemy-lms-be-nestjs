import { CustomBaseEntity } from 'src/common/customBase.entity';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { LessonEntity } from './lesson.entity';
import { ProgressEntity } from './progress.entity';

@Entity({
  name: 'progress_lessons',
})
@Unique(['progressId', 'lessonId'])
export class ProgressLessonsEntity extends CustomBaseEntity {
  @Column({
    name: 'progress_id',
  })
  progressId: number;

  @ManyToOne(
    () => ProgressEntity,
    (progress: ProgressEntity) => progress.progressLessons,
  )
  @JoinColumn({
    name: 'progress_id',
  })
  progress: ProgressEntity;

  @Column({
    name: 'lesson_id',
  })
  lessonId: number;

  @ManyToOne(() => LessonEntity)
  @JoinColumn({ name: 'lesson_id' })
  lesson: LessonEntity;
}
