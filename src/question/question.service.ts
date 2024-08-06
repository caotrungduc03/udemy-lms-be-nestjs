import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';
import { CreateQuestionDto, UpdateQuestionDto } from 'src/dtos';
import { QuestionEntity } from 'src/entities';
import { ExerciseService } from 'src/exercise/exercise.service';
import { UserService } from 'src/user/user.service';
import { FindOptions } from 'src/utils/i.options';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class QuestionService extends BaseService<QuestionEntity> {
  constructor(
    @InjectRepository(QuestionEntity)
    private readonly questionRepository: Repository<QuestionEntity>,
    private readonly exerciseService: ExerciseService,
    private readonly userService: UserService,
  ) {
    super(questionRepository);
  }

  async create(
    createQuestionDto: CreateQuestionDto,
    userId: number,
  ): Promise<QuestionEntity> {
    const { exerciseId } = createQuestionDto;
    const exercise = await this.exerciseService.findById(exerciseId);

    return this.store({
      ...createQuestionDto,
      exercise,
    });
  }

  async findById(id: number, options?: FindOptions): Promise<QuestionEntity> {
    const { relations = [] } = options || {};
    const question = await this.findOne({
      where: { id },
      relations,
    });
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    return question;
  }

  async updateById(
    id: number,
    userId: number,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<QuestionEntity> {
    const question = await this.findByIdAndAuthorize(id, userId);

    return this.store({
      ...question,
      ...updateQuestionDto,
    });
  }

  async deleteById(id: number, userId: number): Promise<DeleteResult> {
    const question = await this.findByIdAndAuthorize(id, userId);

    return this.delete(id);
  }

  async findByIdAndAuthorize(
    id: number,
    userId: number,
  ): Promise<QuestionEntity> {
    const [question, hasAdminRole] = await Promise.all([
      this.findById(id, {
        relations: ['exercise', 'exercise.course'],
      }),
      this.userService.checkAdminRole(userId),
    ]);
    const isAuthor = question.exercise.course.authorId === userId;
    if (!isAuthor && !hasAdminRole) {
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );
    }

    return question;
  }
}
