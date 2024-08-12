import { CustomBaseEntity } from 'src/common/customBase.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ExerciseEntity } from './exercise.entity';
import { ProgressExerciseQuestionEntity } from './progressExerciseQuestion.entity';

export enum QuestionTypeEnum {
  CHOICE = 'CHOICE',
  FILL = 'FILL',
}

@Entity({
  name: 'questions',
})
export class QuestionEntity extends CustomBaseEntity {
  @Column({
    name: 'question_title',
    nullable: false,
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
    nullable: false,
  })
  answers: string[];

  @Column({
    name: 'correct_answers',
    type: 'text',
    array: true,
    nullable: false,
  })
  correctAnswers: string[];

  @Column({
    type: 'float',
    name: 'max_point',
    nullable: false,
  })
  maxPoint: number;

  @Column({
    name: 'exercise_id',
    nullable: false,
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
