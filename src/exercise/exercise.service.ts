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
import { FindOptions } from 'src/utils/i.options';
import { pickFields } from 'src/utils/pickFields';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class ExerciseService extends BaseService<ExerciseEntity> {
  constructor(
    @InjectRepository(ExerciseEntity)
    private readonly exerciseRepository: Repository<ExerciseEntity>,
    private readonly courseService: CourseService,
  ) {
    super(exerciseRepository);
  }

  async create(
    createExerciseDto: CreateExerciseDto,
    userId: number,
  ): Promise<ExerciseEntity> {
    const { courseId, deadline } = createExerciseDto;
    const course = await this.courseService.findByIdAndAuthorize(
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
      'min_passing_score',
      'max_tries',
    ]);

    if (isBefore(deadline, new Date())) {
      throw new BadRequestException('Deadline cannot be in the past');
    }

    const exercise = await this.findById(id);
    const course = await this.courseService.findByIdAndAuthorize(
      exercise.courseId,
      userId,
    );

    return this.store({
      ...exercise,
      ...updateData,
      course,
    });
  }

  async deleteById(id: number, userId: number): Promise<DeleteResult> {
    const exercise = await this.findById(id);
    const course = await this.courseService.findByIdAndAuthorize(
      exercise.courseId,
      userId,
    );

    return this.delete(id);
  }
}
