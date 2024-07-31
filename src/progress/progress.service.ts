import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';
import { CourseService } from 'src/course/course.service';
import { CreateProgressDto } from 'src/dtos';
import { ProgressEntity } from 'src/entities';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class ProgressService extends BaseService<ProgressEntity> {
  constructor(
    @InjectRepository(ProgressEntity)
    private readonly progressRepository: Repository<ProgressEntity>,
    private readonly courseService: CourseService,
  ) {
    super(progressRepository);
  }

  async create(createProgressDto: CreateProgressDto): Promise<ProgressEntity> {
    const { userId, courseId } = createProgressDto;
    const [course, progress] = await Promise.all([
      this.courseService.findById(courseId),
      this.findOne({
        where: {
          userId,
          courseId,
        },
      }),
    ]);
    if (progress) {
      throw new BadRequestException('Progress already exists');
    }

    return this.store({ ...createProgressDto, course });
  }

  async findById(id: number): Promise<ProgressEntity> {
    const progress = await this.findOne({
      where: { id },
      relations: ['course'],
    });
    if (!progress) {
      throw new BadRequestException('Progress not found');
    }

    return progress;
  }

  async findByIdAndVerifyUser(
    userId: number,
    id: number,
  ): Promise<ProgressEntity> {
    const progress = await this.findById(id);

    if (progress.userId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to access this progress',
      );
    }

    return progress;
  }

  async findStudentByCourseId(
    courseId: number,
    userId: number,
  ): Promise<[number, number, number, ProgressEntity[]]> {
    const course = await this.courseService.findByIdAndVerifyAuthor(
      courseId,
      userId,
    );

    return this.query({ courseId }, ['course', 'user']);
  }

  async deleteById(id: number, userId: number): Promise<DeleteResult> {
    const progress = await this.findById(id);
    const { courseId } = progress;
    const course = await this.courseService.findById(courseId);

    if (progress.userId !== userId || course.authorId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to delete this progress',
      );
    }

    return this.delete(id);
  }
}
