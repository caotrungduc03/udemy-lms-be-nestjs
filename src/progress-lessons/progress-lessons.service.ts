import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';
import { CreateProgressLessonsDto } from 'src/dtos';
import { ProgressLessonsEntity } from 'src/entities';
import { LessonService } from 'src/lesson/lesson.service';
import { ProgressService } from 'src/progress/progress.service';
import { Repository } from 'typeorm';

@Injectable()
export class ProgressLessonsService extends BaseService<ProgressLessonsEntity> {
  constructor(
    @InjectRepository(ProgressLessonsEntity)
    private readonly progressLessonsRepository: Repository<ProgressLessonsEntity>,
    private readonly progressService: ProgressService,
    private readonly lessonService: LessonService,
  ) {
    super(progressLessonsRepository);
  }

  async create(
    createProgressLessonsDto: CreateProgressLessonsDto,
    userId: number,
  ): Promise<ProgressLessonsEntity> {
    const { progressId, lessonId } = createProgressLessonsDto;
    const [progress, lesson] = await Promise.all([
      this.progressService.findByIdAndVerifyUser(progressId, userId),
      this.lessonService.findById(lessonId),
    ]);

    return this.store({
      ...createProgressLessonsDto,
      progress,
      lesson,
    });
  }
}
