import { CustomBaseEntity } from 'src/common/customBase.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ExerciseEntity } from './exercise.entity';

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
  })
  questionType: string;

  @Column({
    name: 'answers',
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
    name: 'exercise_id',
  })
  exerciseId: number;

  @ManyToOne(() => ExerciseEntity, (exercise) => exercise.questions)
  @JoinColumn({
    name: 'exercise_id',
  })
  exercise: ExerciseEntity;
}
