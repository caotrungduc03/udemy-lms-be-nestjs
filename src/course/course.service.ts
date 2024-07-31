import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryService } from 'src/category/category.service';
import { BaseService } from 'src/common/base.service';
import { CreateCourseDto, UpdateCourseDto } from 'src/dtos';
import { CourseEntity } from 'src/entities';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class CourseService extends BaseService<CourseEntity> {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
    private readonly categoryService: CategoryService,
  ) {
    super(courseRepository);
  }

  async findAll(): Promise<CourseEntity[]> {
    return await this.courseRepository.find({
      relations: ['author', 'category'],
    });
  }

  async findById(id: number): Promise<CourseEntity> {
    const course: CourseEntity = await this.courseRepository.findOne({
      where: { id },
      relations: ['author', 'category'],
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async create(createCourseDto: CreateCourseDto): Promise<CourseEntity> {
    const course = await this.courseRepository.save(createCourseDto);

    return course;
  }

  async updateById(
    id: number,
    updateCourseDto: UpdateCourseDto,
  ): Promise<CourseEntity> {
    const { authorId, ...remainingData } = updateCourseDto;
    const course: CourseEntity = await this.findById(id);

    if (authorId !== course.authorId) {
      throw new ForbiddenException('You are not allowed to update this course');
    }

    if (course.categoryId !== remainingData.categoryId) {
      const category = await this.categoryService.findById(
        remainingData.categoryId,
      );
      course.category = category;
    }

    return this.courseRepository.save({
      ...course,
      ...remainingData,
    });
  }

  async deleteById(id: number, authorId: number): Promise<DeleteResult> {
    const course: CourseEntity = await this.findById(id);

    if (authorId !== course.authorId) {
      throw new ForbiddenException('You are not allowed to delete this course');
    }

    return this.courseRepository.delete(id);
  }

  async findByIdAndVerifyAuthor(id: number, authorId: number) {
    const course = await this.findById(id);
    if (course.authorId !== authorId) {
      throw new ForbiddenException('You are not allowed to access this course');
    }

    return course;
  }
}
