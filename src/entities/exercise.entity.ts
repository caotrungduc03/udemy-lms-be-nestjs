import { CustomBaseEntity } from 'src/common/customBase.entity';
import {
  BeforeRemove,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { CourseEntity } from './course.entity';
import { QuestionEntity } from './question.entity';

@Entity({ name: 'exercises' })
export class ExerciseEntity extends CustomBaseEntity {
  @Column({
    name: 'exercise_name',
    nullable: false,
  })
  exerciseName: string;

  @Column({
    type: 'text',
  })
  description: string;

  @Column({
    name: 'exercise_type',
    nullable: false,
  })
  exerciseType: string;

  @Column()
  duration: number;

  @Column({
    type: 'timestamptz',
  })
  deadline: Date;

  @Column({
    name: 'min_passing_score',
    type: 'float',
    nullable: false,
  })
  min_passing_score: number;

  @Column({
    name: 'max_tries',
    nullable: false,
  })
  max_tries: number;

  @Column({
    name: 'course_id',
    nullable: false,
  })
  courseId: number;

  @ManyToOne(() => CourseEntity, (course: CourseEntity) => course.exercises)
  @JoinColumn({
    name: 'course_id',
  })
  course: CourseEntity;

  @OneToMany(
    () => QuestionEntity,
    (question: QuestionEntity) => question.exercise,
  )
  questions: QuestionEntity[];

  @BeforeRemove()
  async beforeRemove(): Promise<void> {
    if (this.questions) {
      await Promise.all(this.questions.map((question) => question.remove()));
    }
  }
}
