import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';
import { CreateProgressExerciseDto } from 'src/dtos';
import { ProgressExerciseEntity } from 'src/entities';
import { ExerciseService } from 'src/exercise/exercise.service';
import { ProgressService } from 'src/progress/progress.service';
import { FindOptions } from 'src/utils/options';
import { Repository } from 'typeorm';
import { ProgressExerciseQuestionService } from './../progress-exercise-question/progress-exercise-question.service';

@Injectable()
export class ProgressExerciseService extends BaseService<ProgressExerciseEntity> {
  constructor(
    @InjectRepository(ProgressExerciseEntity)
    private readonly progressExerciseRepository: Repository<ProgressExerciseEntity>,
    private readonly progressExerciseQuestionService: ProgressExerciseQuestionService,
    private readonly progressService: ProgressService,
    private readonly exerciseService: ExerciseService,
  ) {
    super(progressExerciseRepository);
  }

  async findById(id: number, options?: FindOptions): Promise<any> {
    const { relations = [] } = options || {};

    const progressExercise = await this.findOne({
      where: { id },
      relations,
    });
    if (!progressExercise) {
      throw new BadRequestException('Progress exercise not found');
    }

    return progressExercise;
  }

  async findByIdAndVerifyUser(
    id: number,
    userId: number,
    options?: FindOptions,
  ): Promise<ProgressExerciseEntity> {
    const progressExercise = await this.findById(id, {
      relations: ['progress'],
      ...options,
    });
    const isCurrentUser = progressExercise.progress.userId === userId;
    if (!isCurrentUser) {
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );
    }

    return progressExercise;
  }

  async create(
    createProgressExerciseDto: CreateProgressExerciseDto,
    userId: number,
  ): Promise<ProgressExerciseEntity> {
    const { progressId, exerciseId } = createProgressExerciseDto;
    const [progress, exercise] = await Promise.all([
      this.progressService.findByIdAndVerifyUser(progressId, userId),
      this.exerciseService.findById(exerciseId),
    ]);
    if (progress.courseId !== exercise.courseId) {
      throw new BadRequestException('Course does not match');
    }

    const currentTryCount = await this.progressExerciseRepository.count({
      where: {
        progressId,
        exerciseId,
      },
    });
    if (currentTryCount >= exercise.max_tries) {
      throw new BadRequestException('Max tries reached');
    }

    return this.store({
      ...exercise,
      ...createProgressExerciseDto,
      tryCount: currentTryCount + 1,
      progress,
      exercise,
    });
  }
}
