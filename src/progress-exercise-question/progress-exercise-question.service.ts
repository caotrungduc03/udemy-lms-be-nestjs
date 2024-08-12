import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';
import { ProgressExerciseQuestionEntity } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class ProgressExerciseQuestionService extends BaseService<ProgressExerciseQuestionEntity> {
  constructor(
    @InjectRepository(ProgressExerciseQuestionEntity)
    private readonly progressExerciseQuestionRepository: Repository<ProgressExerciseQuestionEntity>,
  ) {
    super(progressExerciseQuestionRepository);
  }
}
