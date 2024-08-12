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
import { UserService } from 'src/user/user.service';
import { FindOptions } from 'src/utils/options';
import { Repository } from 'typeorm';

@Injectable()
export class ProgressService extends BaseService<ProgressEntity> {
  constructor(
    @InjectRepository(ProgressEntity)
    private readonly progressRepository: Repository<ProgressEntity>,
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

  async findByIdAndVerifyUser(
    id: number,
    userId: number,
    options?: FindOptions,
  ): Promise<ProgressEntity> {
    const { relations = [] } = options || {};

    const progress = await this.findById(id, { relations });
    const isCurrentUser = progress.userId === userId;
    if (!isCurrentUser) {
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );
    }

    return progress;
  }

  async findByIdAndVerifyAuthor(
    id: number,
    userId: number,
  ): Promise<ProgressEntity> {
    const [progress, hasAdminRole] = await Promise.all([
      this.findById(id, {
        relations: ['course'],
      }),
      this.userService.checkAdminRole(userId),
    ]);
    const isAuthor = progress.course.authorId === userId;
    if (!isAuthor && !hasAdminRole) {
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );
    }

    return progress;
  }

  async updateStatusById(id: number, userId: number): Promise<ProgressEntity> {
    const progress = await this.findByIdAndVerifyAuthor(id, userId);

    return this.store({
      ...progress,
      status: !progress.status,
    });
  }
}
