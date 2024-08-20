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
import { Repository } from 'typeorm';

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

  async findByIdAndVerifyAuthor(
    id: number,
    userId: number,
    options?: FindOptions,
  ) {
    const [course, hasAdminRole] = await Promise.all([
      this.findById(id, options),
      this.userService.checkAdminRole(userId),
    ]);
    const isAuthor = course.authorId === userId;
    if (!isAuthor && !hasAdminRole) {
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );
    }

    return course;
  }

  async findCourseIds(whereObj: any): Promise<number[]> {
    const course = await this.findAll({
      where: {
        ...whereObj,
      },
      select: ['id'],
    });

    return course.map((course) => course.id);
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
      status: false,
    });
  }

  async updateById(
    id: number,
    updateCourseDto: UpdateCourseDto,
  ): Promise<CourseEntity> {
    const { authorId, categoryId } = updateCourseDto;
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

    const course = await this.findByIdAndVerifyAuthor(id, authorId);

    if (course.categoryId !== categoryId) {
      const category = await this.categoryService.findById(categoryId);
      course.category = category;
    }

    return this.store({
      ...course,
      ...updateData,
    });
  }

  async updateStatusById(id: number, userId: number): Promise<CourseEntity> {
    const course = await this.findByIdAndVerifyAuthor(id, userId);
    return this.store({
      ...course,
      status: !course.status,
    });
  }

  async deleteById(id: number, userId: number): Promise<CourseEntity> {
    const course = await this.findByIdAndVerifyAuthor(id, userId, {
      relations: ['lessons', 'exercises', 'exercises.questions'],
    });

    return this.remove(course);
  }

  async checkAuthor(id: number, authorId: number) {
    const course = await this.findById(id);

    return course.authorId === authorId;
  }
}
