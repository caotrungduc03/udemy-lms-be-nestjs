import { Controller } from '@nestjs/common';
import { ProgressExerciseQuestionService } from './progress-exercise-question.service';

@Controller('progress-exercises-questions')
export class ProgressExerciseQuestionController {
  constructor(
    private readonly progressExerciseQuestionService: ProgressExerciseQuestionService,
  ) {}
}
