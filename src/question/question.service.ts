import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';
import {
  CreateQuestionDto,
  UpdateQuestionDto,
  UpdateQuestionsDto,
} from 'src/dtos';
import { QuestionEntity } from 'src/entities';
import { ExerciseService } from 'src/exercise/exercise.service';
import { UserService } from 'src/user/user.service';
import { FindOptions } from 'src/utils/options';
import { Repository } from 'typeorm';

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

  async findByIdAndVerifyAuthor(
    id: number,
    userId: number,
    options?: FindOptions,
  ) {
    const question = await this.findById(id, options);
    const exercise = await this.exerciseService.findByIdAndVerifyAuthor(
      question.exerciseId,
      userId,
    );

    return question;
  }

  async create(
    createQuestionDto: CreateQuestionDto,
    userId: number,
  ): Promise<QuestionEntity[]> {
    const { exerciseId, questions } = createQuestionDto;
    const exercise = await this.exerciseService.findByIdAndVerifyAuthor(
      exerciseId,
      userId,
    );

    return Promise.all(
      questions.map((question) =>
        this.store({
          ...question,
          exerciseId: exercise.id,
        }),
      ),
    );
  }

  async updateById(
    id: number,
    userId: number,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<QuestionEntity> {
    const question = await this.findByIdAndVerifyAuthor(id, userId);

    return this.store({
      ...question,
      ...updateQuestionDto,
    });
  }

  async updateByExerciseId(
    exerciseId: number,
    updateQuestionsDto: UpdateQuestionsDto,
    userId: number,
  ) {
    const exercise = await this.exerciseService.findByIdAndVerifyAuthor(
      exerciseId,
      userId,
      {
        relations: ['questions'],
      },
    );

    const questions = await Promise.all(
      exercise.questions.map((question) => {
        const updateQuestion = updateQuestionsDto.questions.find(
          (updateQuestion) => updateQuestion.id === question.id,
        );
        return this.store({
          ...question,
          ...updateQuestion,
        });
      }),
    );

    return questions;
  }

  async deleteById(id: number, userId: number): Promise<QuestionEntity> {
    const question = await this.findByIdAndVerifyAuthor(id, userId);

    return this.remove(question);
  }
}
