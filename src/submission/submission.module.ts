import { Module } from '@nestjs/common';
import { ProgressExerciseQuestionModule } from 'src/progress-exercise-question/progress-exercise-question.module';
import { ProgressExerciseModule } from 'src/progress-exercise/progress-exercise.module';
import { ProgressModule } from 'src/progress/progress.module';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';

@Module({
  imports: [
    ProgressModule,
    ProgressExerciseModule,
    ProgressExerciseQuestionModule,
  ],
  controllers: [SubmissionController],
  providers: [SubmissionService],
})
export class SubmissionModule {}
