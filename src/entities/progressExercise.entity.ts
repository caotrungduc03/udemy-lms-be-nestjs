import { CustomBaseEntity } from 'src/common/customBase.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { ExerciseEntity } from './exercise.entity';
import { ProgressEntity } from './progress.entity';
import { ProgressExerciseQuestionEntity } from './progressExerciseQuestion.entity';

@Entity({
  name: 'progress_exercises',
})
@Unique(['progressId', 'exerciseId', 'tryCount'])
export class ProgressExerciseEntity extends CustomBaseEntity {
  @Column({
    name: 'try_count',
  })
  tryCount: number;

  @Column({
    name: 'progress_id',
  })
  progressId: number;

  @ManyToOne(
    () => ProgressEntity,
    (progress: ProgressEntity) => progress.progressExercises,
  )
  @JoinColumn({
    name: 'progress_id',
  })
  progress: ProgressEntity;

  @Column({
    name: 'exercise_id',
  })
  exerciseId: number;

  @ManyToOne(
    () => ExerciseEntity,
    (exercise: ExerciseEntity) => exercise.progressExercises,
  )
  @JoinColumn({
    name: 'exercise_id',
  })
  exercise: ExerciseEntity;

  @OneToMany(
    () => ProgressExerciseQuestionEntity,
    (question) => question.progressExercise,
  )
  progressExercisesQuestions: ProgressExerciseQuestionEntity[];
}
