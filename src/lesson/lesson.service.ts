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
import { FindOptions } from 'src/utils/i.options';
import { pickFields } from 'src/utils/pickFields';

@Injectable()
export class LessonService extends BaseService<LessonEntity> {
  constructor(
    @InjectRepository(LessonEntity) private readonly lessonRepository,
    private readonly courseService: CourseService,
  ) {
    super(lessonRepository);
  }

  async create(createLessonDto: CreateLessonDto) {
    const { courseId } = createLessonDto;
    const course = await this.courseService.findById(courseId);

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

    const lesson = await this.findById(id, {
      relations: ['course'],
    });
    if (lesson.course.authorId !== userId) {
      throw new ForbiddenException('You are not allowed to update this lesson');
    }

    return this.store({
      ...lesson,
      ...updateData,
    });
  }

  async deleteById(id: number, userId: number) {
    const lesson = await this.findById(id, {
      relations: ['course'],
    });
    if (lesson.course.authorId !== userId) {
      throw new ForbiddenException('You are not allowed to delete this lesson');
    }

    return this.delete(id);
  }
}
