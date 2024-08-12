import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgressExerciseEntity } from 'src/entities';
import { ExerciseModule } from 'src/exercise/exercise.module';
import { ProgressExerciseQuestionModule } from 'src/progress-exercise-question/progress-exercise-question.module';
import { ProgressModule } from 'src/progress/progress.module';
import { ProgressExerciseController } from './progress-exercise.controller';
import { ProgressExerciseService } from './progress-exercise.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProgressExerciseEntity]),
    ProgressExerciseQuestionModule,
    ProgressModule,
    ExerciseModule,
  ],
  controllers: [ProgressExerciseController],
  providers: [ProgressExerciseService],
  exports: [ProgressExerciseService],
})
export class ProgressExerciseModule {}
