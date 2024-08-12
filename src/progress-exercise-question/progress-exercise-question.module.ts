import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgressExerciseQuestionEntity } from 'src/entities';
import { ProgressExerciseQuestionController } from './progress-exercise-question.controller';
import { ProgressExerciseQuestionService } from './progress-exercise-question.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProgressExerciseQuestionEntity])],
  controllers: [ProgressExerciseQuestionController],
  providers: [ProgressExerciseQuestionService],
  exports: [ProgressExerciseQuestionService],
})
export class ProgressExerciseQuestionModule {}
