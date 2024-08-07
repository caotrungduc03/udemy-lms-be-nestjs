import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';
import { CourseService } from 'src/course/course.service';
import { CreateProgressDto } from 'src/dtos';
import { ProgressEntity, ProgressLessonsEntity } from 'src/entities';
import { UserService } from 'src/user/user.service';
import { FindOptions } from 'src/utils/options';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class ProgressService extends BaseService<ProgressEntity> {
  constructor(
    @InjectRepository(ProgressEntity)
    private readonly progressRepository: Repository<ProgressEntity>,
    @InjectRepository(ProgressLessonsEntity)
    private readonly progressLessonsRepository: Repository<ProgressLessonsEntity>,
    private readonly courseService: CourseService,
    private readonly userService: UserService,
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

  async findById(id: number, options?: FindOptions): Promise<ProgressEntity> {
    const { relations = [] } = options || {};

    const progress = await this.findOne({
      where: { id },
      relations,
    });
    if (!progress) {
      throw new BadRequestException('Progress not found');
    }

    return progress;
  }

  async findByIdAndVerifyUser(
    id: number,
    userId: number,
    options?: FindOptions,
  ): Promise<ProgressEntity> {
    const { relations = [] } = options || {};

    const [progress, hasAdminRole] = await Promise.all([
      this.findById(id, {
        relations,
      }),
      this.userService.checkAdminRole(userId),
    ]);
    const isCurrentUser = progress.userId === userId;
    if (!isCurrentUser && !hasAdminRole) {
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );
    }

    return progress;
  }

  async deleteById(id: number, userId: number): Promise<DeleteResult> {
    const progress = await this.findById(id);
    const { courseId } = progress;
    const [isAuthor, hasAdminRole] = await Promise.all([
      this.courseService.checkAuthor(courseId, userId),
      this.userService.checkAdminRole(userId),
    ]);
    const isCurrentUser = progress.userId === userId;
    if (!isCurrentUser && !isAuthor && !hasAdminRole) {
      throw new ForbiddenException(
        'You are not allowed to delete this progress',
      );
    }

    await this.progressLessonsRepository.delete({
      progressId: id,
    });

    return this.delete(id);
  }

  async findByCourseId(courseId: number, userId: number) {
    const filter: any = { courseId };
    const [isAuthor, hasAdminRole] = await Promise.all([
      this.courseService.checkAuthor(courseId, userId),
      this.userService.checkAdminRole(userId),
    ]);

    if (isAuthor && !hasAdminRole) {
      filter.userId = userId;
    }

    return this.query(
      { ...filter },
      {
        relations: ['course', 'user', 'progressLessons'],
      },
    );
  }
}
