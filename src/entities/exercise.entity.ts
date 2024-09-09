import { CustomBaseEntity } from 'src/common/customBase.entity';
import { ExerciseTypeEnum } from 'src/enums';
import {
  BeforeRemove,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { CourseEntity } from './course.entity';
import { ProgressExerciseEntity } from './progressExercise.entity';
import { QuestionEntity } from './question.entity';

@Entity({ name: 'exercises' })
export class ExerciseEntity extends CustomBaseEntity {
  @Column({
    name: 'exercise_name',
  })
  exerciseName: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    name: 'exercise_type',
    type: 'enum',
    enum: ExerciseTypeEnum,
  })
  exerciseType: string;

  @Column()
  duration: number;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  deadline: Date;

  @Column({
    name: 'min_passing_percentage',
    type: 'float',
  })
  minPassingPercentage: number;

  @Column({
    name: 'max_tries',
  })
  maxTries: number;

  @Column({
    name: 'course_id',
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

  @OneToMany(
    () => ProgressExerciseEntity,
    (progress: ProgressExerciseEntity) => progress.exercise,
  )
  progressExercises: ProgressExerciseEntity[];

  @BeforeRemove()
  async beforeRemove(): Promise<void> {
    if (this.questions) {
      await Promise.all(this.questions.map((question) => question.remove()));
    }
  }
}
