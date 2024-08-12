import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';
import { CourseService } from 'src/course/course.service';
import { CreateLessonDto, UpdateLessonDto } from 'src/dtos';
import { LessonEntity } from 'src/entities';
import { UserService } from 'src/user/user.service';
import { FindOptions } from 'src/utils/options';
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

  async findByIdAndVerifyAuthor(
    id: number,
    userId: number,
    options?: FindOptions,
  ) {
    const lesson = await this.findById(id, options);
    const course = await this.courseService.findByIdAndVerifyAuthor(
      lesson.courseId,
      userId,
    );

    return lesson;
  }

  async create(userId: number, createLessonDto: CreateLessonDto) {
    const { courseId } = createLessonDto;
    const course = await this.courseService.findByIdAndVerifyAuthor(
      courseId,
      userId,
    );

    return this.store({
      ...createLessonDto,
      course,
    });
  }

  async updateById(id: number, userId: number, updateLesson: UpdateLessonDto) {
    const updateData = pickFields(updateLesson, [
      'lessonName',
      'description',
      'duration',
      'content',
    ]);

    const lesson = await this.findByIdAndVerifyAuthor(id, userId);

    return this.store({
      ...lesson,
      ...updateData,
    });
  }

  async deleteById(id: number, userId: number) {
    const lesson = await this.findByIdAndVerifyAuthor(id, userId);

    return this.delete(id);
  }
}
