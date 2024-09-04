import { CustomBaseEntity } from 'src/common/customBase.entity';
import { QuestionTypeEnum } from 'src/enums';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ExerciseEntity } from './exercise.entity';
import { ProgressExerciseQuestionEntity } from './progressExerciseQuestion.entity';

@Entity({
  name: 'questions',
})
export class QuestionEntity extends CustomBaseEntity {
  @Column({
    name: 'question_title',
  })
  questionTitle: string;

  @Column({
    name: 'question_type',
    type: 'enum',
    enum: QuestionTypeEnum,
  })
  questionType: QuestionTypeEnum;

  @Column({
    type: 'text',
    array: true,
  })
  answers: string[];

  @Column({
    name: 'correct_answers',
    type: 'text',
    array: true,
  })
  correctAnswers: string[];

  @Column({
    type: 'float',
    name: 'max_point',
  })
  maxPoint: number;

  @Column({
    name: 'exercise_id',
  })
  exerciseId: number;

  @ManyToOne(() => ExerciseEntity, (exercise) => exercise.questions)
  @JoinColumn({
    name: 'exercise_id',
  })
  exercise: ExerciseEntity;

  @OneToMany(
    () => ProgressExerciseQuestionEntity,
    (processExerciseQuestion) => processExerciseQuestion.question,
  )
  progressExercisesQuestions: ProgressExerciseQuestionEntity[];
}
