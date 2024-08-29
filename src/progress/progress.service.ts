import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';
import { CourseService } from 'src/course/course.service';
import { CreateProgressDto, ProgressDto } from 'src/dtos';
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
    if (!course.status) {
      throw new ForbiddenException('Course is not active');
    }
    if (progress) {
      throw new BadRequestException('Progress already exists');
    }

    return this.store({
      ...createProgressDto,
      course,
    });
  }

  async findById(id: number, options?: FindOptions): Promise<ProgressEntity> {
    if (!id) {
      throw new BadRequestException('ProgressId is required');
    }
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

  async findOneByCourseId(
    courseId: number,
    userId: number,
  ): Promise<ProgressDto> {
    const progress = await this.findOne({
      where: {
        userId,
        courseId,
      },
      relations: ['progressLessons', 'progressExercises'],
    });
    if (!progress) {
      throw new BadRequestException('Progress not found');
    }
    if (!progress.status) {
      throw new ForbiddenException('Progress is not active');
    }

    const progressDto = ProgressDto.plainToInstance(progress);
    progressDto.progressLessonIds = progress.progressLessons.map(
      (progressLesson) => progressLesson.lessonId,
    );
    progressDto.progressExerciseIds = [
      ...new Set(
        progress.progressExercises.map(
          (progressExercise) => progressExercise.exerciseId,
        ),
      ),
    ];

    return progressDto;
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
    if (!progress.status) {
      throw new ForbiddenException('Progress is not active');
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

  async queryProgress(
    query: Object,
  ): Promise<[number, number, number, ProgressDto[]]> {
    const [page, limit, total, progress] = await this.query(query, {
      relations: [
        'course',
        'course.author',
        'course.lessons',
        'course.exercises',
        'progressLessons',
        'progressExercises',
      ],
    });

    const progressDtos = progress.map((progress) => {
      const progressDto = ProgressDto.plainToInstance(progress);
      const completedLesson = progress.progressLessons.map(
        (p) => p.lessonId,
      ).length;
      const completedExercise = new Set(
        progress.progressExercises.map((p) => p.exerciseId),
      ).size;
      const totalLessons = progress.course.lessons.length;
      const totalExercises = progress.course.exercises.length;

      if (totalLessons + totalExercises === 0) {
        progressDto.percentage = 0;
      } else {
        progressDto.percentage = Number(
          (
            ((completedLesson + completedExercise) /
              (totalLessons + totalExercises)) *
            100
          ).toFixed(2),
        );
      }

      return progressDto;
    });

    return [page, limit, total, progressDtos];
  }

  async updateStatusById(id: number, userId: number): Promise<ProgressEntity> {
    const progress = await this.findByIdAndVerifyAuthor(id, userId);

    return this.store({
      ...progress,
      status: !progress.status,
    });
  }
}
