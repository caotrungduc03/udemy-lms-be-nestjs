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
import { UserService } from 'src/user/user.service';
import { FindOptions } from 'src/utils/options';
import { pickFields } from 'src/utils/pickFields';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class CourseService extends BaseService<CourseEntity> {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
    private readonly userService: UserService,
    private readonly categoryService: CategoryService,
  ) {
    super(courseRepository);
  }

  async findById(id: number, options?: FindOptions): Promise<CourseEntity> {
    const { relations = [] } = options || {};

    const course = await this.findOne({
      where: { id },
      relations,
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async create(createCourseDto: CreateCourseDto): Promise<CourseEntity> {
    const { authorId, categoryId } = createCourseDto;
    const [author, category] = await Promise.all([
      this.userService.findById(authorId),
      this.categoryService.findById(categoryId),
    ]);

    return this.store({
      ...createCourseDto,
      author,
      category,
    });
  }

  async updateById(
    id: number,
    updateCourseDto: UpdateCourseDto,
  ): Promise<CourseEntity> {
    const updateData = pickFields(updateCourseDto, [
      'courseName',
      'description',
      'categoryId',
      'coverImage',
      'priceType',
      'price',
      'language',
      'authorId',
      'categoryId',
    ]);
    const course = await this.findById(id);

    if (updateData.authorId !== course.authorId) {
      throw new ForbiddenException('You are not allowed to update this course');
    }

    if (course.categoryId !== updateData.categoryId) {
      const category = await this.categoryService.findById(
        updateData.categoryId,
      );
      course.category = category;
    }

    return this.store({
      ...course,
      ...updateData,
    });
  }

  async deleteById(id: number, authorId: number): Promise<DeleteResult> {
    const course = await this.findById(id);

    if (authorId !== course.authorId) {
      throw new ForbiddenException('You are not allowed to delete this course');
    }

    return this.delete(id);
  }

  async findByIdAndVerifyAuthor(id: number, authorId: number) {
    const course = await this.findById(id);
    if (course.authorId !== authorId) {
      throw new ForbiddenException('You are not allowed to access this course');
    }

    return course;
  }
}
