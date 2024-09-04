import { CustomBaseEntity } from 'src/common/customBase.entity';
import { GradingStatusEnum } from 'src/enums';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ProgressExerciseEntity } from './progressExercise.entity';
import { QuestionEntity } from './question.entity';

@Entity({
  name: 'progress_exercises_questions',
})
export class ProgressExerciseQuestionEntity extends CustomBaseEntity {
  @Column({
    type: 'text',
    array: true,
  })
  answers: string[];

  @Column({
    type: 'float',
  })
  point: number;

  @Column({
    name: 'grading_status',
    type: 'enum',
    enum: GradingStatusEnum,
    default: GradingStatusEnum.UNGRADED,
  })
  gradingStatus: GradingStatusEnum;

  @Column({
    name: 'progress_exercise_id',
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
