import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';
import { CourseService } from 'src/course/course.service';
import { CreateLessonDto, UpdateLessonDto } from 'src/dtos';
import { LessonEntity } from 'src/entities';
import { UserService } from 'src/user/user.service';
import { FindOptions } from 'src/utils/i.options';
import { pickFields } from 'src/utils/pickFields';

@Injectable()
export class LessonService extends BaseService<LessonEntity> {
  constructor(
    @InjectRepository(LessonEntity) private readonly lessonRepository,
    private readonly courseService: CourseService,
    private readonly userService: UserService,
  ) {
    super(lessonRepository);
  }

  async create(userId: number, createLessonDto: CreateLessonDto) {
    const { courseId } = createLessonDto;
    const course = await this.courseService.findByIdAndAuthorize(
      courseId,
      userId,
    );

    return this.store({
      ...createLessonDto,
      course,
    });
  }

  async findById(id: number, options?: FindOptions) {
    const { relations = [] } = options || {};

    const lesson = await this.findOne({
      where: { id },
      relations,
    });
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return lesson;
  }

  async updateById(id: number, userId: number, updateLesson: UpdateLessonDto) {
    const updateData = pickFields(updateLesson, [
      'lessonName',
      'description',
      'duration',
      'content',
    ]);

    const lesson = this.findByIdAndAuthorize(id, userId);

    return this.store({
      ...lesson,
      ...updateData,
    });
  }

  async deleteById(id: number, userId: number) {
    const lesson = await this.findByIdAndAuthorize(id, userId);

    return this.delete(id);
  }

  async findByIdAndAuthorize(id: number, userId: number) {
    const [lesson, hasAdminRole] = await Promise.all([
      this.findById(id, {
        relations: ['course'],
      }),
      this.userService.checkAdminRole(userId),
    ]);
    const isAuthor = lesson.course.authorId === userId;
    if (!isAuthor && !hasAdminRole) {
      throw new ForbiddenException('You are not allowed to access this lesson');
    }

    return lesson;
  }
}
