import { CustomBaseEntity } from 'src/common/customBase.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ProgressExerciseEntity } from './progressExercise.entity';
import { QuestionEntity } from './question.entity';

export enum GradingStatusEnum {
  UNGRADED = 'ungraded',
  GRADED = 'graded',
}

@Entity({
  name: 'progress_exercises_questions',
})
export class ProgressExerciseQuestionEntity extends CustomBaseEntity {
  @Column({
    type: 'text',
    array: true,
    nullable: false,
  })
  answers: string[];

  @Column({
    type: 'float',
    nullable: false,
  })
  point: number;

  @Column({
    name: 'grading_status',
    type: 'enum',
    enum: GradingStatusEnum,
  })
  gradingStatus: GradingStatusEnum;

  @Column({
    name: 'progress_exercise_id',
    nullable: false,
  })
  progressExerciseId: number;

  @ManyToOne(
    () => ProgressExerciseEntity,
    (progress: ProgressExerciseEntity) => progress.progressExercisesQuestions,
  )
  @JoinColumn({
    name: 'progress_exercise_id',
  })
  progressExercise: ProgressExerciseEntity;

  @Column({
    name: 'question_id',
    nullable: false,
  })
  questionId: number;

  @ManyToOne(
    () => QuestionEntity,
    (question) => question.progressExercisesQuestions,
  )
  @JoinColumn({
    name: 'question_id',
  })
  question: QuestionEntity;
}
