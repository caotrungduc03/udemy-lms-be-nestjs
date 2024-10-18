import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';
import {
  CreateQuestionDto,
  UpdateQuestionDto,
  UpdateQuestionsDto,
} from 'src/dtos';
import { QuestionEntity } from 'src/entities';
import { QuestionTypeEnum } from 'src/enums';
import { ExerciseService } from 'src/exercise/exercise.service';
import { FindOptions } from 'src/utils/options';
import { Repository } from 'typeorm';

@Injectable()
export class QuestionService extends BaseService<QuestionEntity> {
  constructor(
    @InjectRepository(QuestionEntity)
    private readonly questionRepository: Repository<QuestionEntity>,
    private readonly exerciseService: ExerciseService,
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
      questions.map((question) => {
        if (question.questionType === QuestionTypeEnum.SHORT_ANSWER) {
          question.answers = [];
          question.correctAnswers = [];
        }
        if (question.answers.length === 0) {
          question.correctAnswers = [];
        }

        return this.store({
          ...question,
          exerciseId: exercise.id,
        });
      }),
    );
  }

  async updateById(
    id: number,
    userId: number,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<QuestionEntity> {
    const question = await this.findByIdAndVerifyAuthor(id, userId);
    let { questionTitle, questionType, answers, correctAnswers, maxPoint } =
      updateQuestionDto;

    if (questionType === QuestionTypeEnum.SHORT_ANSWER) {
      answers = [];
      correctAnswers = [];
    }
    if (answers.length === 0) {
      correctAnswers = [];
    }

    return this.store({
      ...question,
      questionTitle,
      questionType,
      answers,
      correctAnswers,
      maxPoint,
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

    const updatedQuestions = await Promise.all(
      updateQuestionsDto.questions.map((updateQuestion) => {
        let {
          id,
          questionTitle,
          questionType,
          answers,
          correctAnswers,
          maxPoint,
        } = updateQuestion;
        if (questionType === QuestionTypeEnum.SHORT_ANSWER) {
          answers = [];
          correctAnswers = [];
        }
        if (answers.length === 0) {
          correctAnswers = [];
        }

        const existingQuestion = exercise.questions.find(
          (question) => question.id === id,
        );

        if (existingQuestion) {
          return this.store({
            ...existingQuestion,
            questionTitle,
            questionType,
            answers,
            correctAnswers,
            maxPoint,
          });
        }

        return this.store({
          questionTitle,
          questionType,
          answers,
          correctAnswers,
          maxPoint,
          exerciseId: exercise.id,
        });
      }),
    );

    const questionsToDelete = exercise.questions.filter(
      (question) =>
        !updateQuestionsDto.questions.some(
          (updateQuestion) => updateQuestion.id === question.id,
        ),
    );
    await this.questionRepository.remove(questionsToDelete);

    updatedQuestions.sort((a, b) => a.id - b.id);

    return updatedQuestions;
  }

  async deleteById(id: number, userId: number): Promise<QuestionEntity> {
    const question = await this.findByIdAndVerifyAuthor(id, userId);

    return this.remove(question);
  }
}
