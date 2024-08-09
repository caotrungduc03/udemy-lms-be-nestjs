import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isBefore } from 'date-fns';
import { BaseService } from 'src/common/base.service';
import { CourseService } from 'src/course/course.service';
import { CreateExerciseDto, UpdateExerciseDto } from 'src/dtos';
import { ExerciseEntity } from 'src/entities';
import { UserService } from 'src/user/user.service';
import { FindOptions } from 'src/utils/options';
import { pickFields } from 'src/utils/pickFields';
import { Repository } from 'typeorm';

@Injectable()
export class ExerciseService extends BaseService<ExerciseEntity> {
  constructor(
    @InjectRepository(ExerciseEntity)
    private readonly exerciseRepository: Repository<ExerciseEntity>,
    private readonly courseService: CourseService,
    private readonly userService: UserService,
  ) {
    super(exerciseRepository);
  }

  async create(
    createExerciseDto: CreateExerciseDto,
    userId: number,
  ): Promise<ExerciseEntity> {
    const { courseId, deadline } = createExerciseDto;
    const course = await this.courseService.findByIdAndVerifyAuthor(
      courseId,
      userId,
    );

    if (isBefore(deadline, new Date())) {
      throw new BadRequestException('Deadline cannot be in the past');
    }

    return this.store({
      ...createExerciseDto,
      course,
    });
  }

  async findById(id: number, options?: FindOptions): Promise<ExerciseEntity> {
    const { relations = [] } = options || {};
    const exercise = await this.findOne({
      where: { id },
      relations,
    });
    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    return exercise;
  }

  async findByIdAndVerifyAuthor(
    id: number,
    userId: number,
    options?: FindOptions,
  ): Promise<ExerciseEntity> {
    const exercise = await this.findById(id, options);
    const course = await this.courseService.findByIdAndVerifyAuthor(
      exercise.courseId,
      userId,
    );

    return exercise;
  }

  async updateById(
    id: number,
    userId: number,
    updateExerciseDto: UpdateExerciseDto,
  ): Promise<ExerciseEntity> {
    const { deadline } = updateExerciseDto;
    const updateData = pickFields(updateExerciseDto, [
      'exerciseName',
      'description',
      'exerciseType',
      'duration',
      'deadline',
      'min_passing_percentage',
      'max_tries',
    ]);

    if (isBefore(deadline, new Date())) {
      throw new BadRequestException('Deadline cannot be in the past');
    }

    const exercise = await this.findByIdAndVerifyAuthor(id, userId);

    return this.store({
      ...exercise,
      ...updateData,
    });
  }

  async deleteById(id: number, userId: number): Promise<ExerciseEntity> {
    const exercise: ExerciseEntity = await this.findByIdAndVerifyAuthor(
      id,
      userId,
      {
        relations: ['questions'],
      },
    );

    return this.remove(exercise);
  }
}
