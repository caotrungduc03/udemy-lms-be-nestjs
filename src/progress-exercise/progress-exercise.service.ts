import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';
import {
  AnswerSubmission,
  CreateProgressExerciseDto,
  CreateSubmission,
} from 'src/dtos';
import {
  GradingStatusEnum,
  ProgressExerciseEntity,
  QuestionEntity,
  QuestionTypeEnum,
} from 'src/entities';
import { ExerciseService } from 'src/exercise/exercise.service';
import { ProgressService } from 'src/progress/progress.service';
import { FindOptions } from 'src/utils/options';
import { Repository } from 'typeorm';
import { ProgressExerciseQuestionService } from './../progress-exercise-question/progress-exercise-question.service';

@Injectable()
export class ProgressExerciseService extends BaseService<ProgressExerciseEntity> {
  constructor(
    @InjectRepository(ProgressExerciseEntity)
    private readonly progressExerciseRepository: Repository<ProgressExerciseEntity>,
    private readonly progressExerciseQuestionService: ProgressExerciseQuestionService,
    private readonly progressService: ProgressService,
    private readonly exerciseService: ExerciseService,
  ) {
    super(progressExerciseRepository);
  }

  async findById(id: number, options?: FindOptions): Promise<any> {
    const { relations = [] } = options || {};

    const progressExercise = await this.findOne({
      where: { id },
      relations,
    });
    if (!progressExercise) {
      throw new BadRequestException('Progress exercise not found');
    }

    return progressExercise;
  }

  async findByIdAndVerifyUser(
    id: number,
    userId: number,
    options?: FindOptions,
  ): Promise<ProgressExerciseEntity> {
    const progressExercise = await this.findById(id, {
      relations: ['progress'],
      ...options,
    });
    const isCurrentUser = progressExercise.progress.userId === userId;
    if (!isCurrentUser) {
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );
    }

    return progressExercise;
  }

  async getSubmission(id: number, userId: number): Promise<any> {
    const submission = await this.findByIdAndVerifyUser(id, userId, {
      relations: ['progress', 'progressExercisesQuestions'],
    });

    return submission;
  }

  async create(
    createProgressExerciseDto: CreateProgressExerciseDto,
    userId: number,
  ): Promise<ProgressExerciseEntity> {
    const { progressId, exerciseId } = createProgressExerciseDto;
    const [progress, exercise] = await Promise.all([
      this.progressService.findByIdAndVerifyUser(progressId, userId),
      this.exerciseService.findById(exerciseId),
    ]);
    if (progress.courseId !== exercise.courseId) {
      throw new BadRequestException('Course does not match');
    }

    const currentTryCount = await this.progressExerciseRepository.count({
      where: {
        progressId,
        exerciseId,
      },
    });
    if (currentTryCount >= exercise.max_tries) {
      throw new BadRequestException('Max tries reached');
    }

    return this.store({
      ...exercise,
      ...createProgressExerciseDto,
      tryCount: currentTryCount + 1,
      progress,
      exercise,
    });
  }

  async createSubmission(
    createSubmission: CreateSubmission,
    userId: number,
  ): Promise<any> {
    const { progressExerciseId, submission } = createSubmission;
    const [progressExercise, existingSubmission] = await Promise.all([
      this.findByIdAndVerifyUser(progressExerciseId, userId, {
        relations: ['progress', 'exercise', 'exercise.questions'],
      }),
      this.progressExerciseQuestionService.findOne({
        where: {
          progressExerciseId,
        },
      }),
    ]);

    if (existingSubmission) {
      throw new BadRequestException('Submission already exists');
    }

    const { exercise } = progressExercise;
    const { questions } = exercise;

    let numberOfChoiceQuestions = 0;
    let numberOfFillQuestions = 0;
    let totalPointChoiceQuestions = 0;
    let numberOfCorrectChoiceAnswers = 0;
    let numberOfIncorrectChoiceAnswers = 0;
    let gainedPointChoiceQuestions = 0;

    await Promise.all(
      submission.map(async (answer: AnswerSubmission) => {
        const question = questions.find(
          (question) => question.id === answer.questionId,
        );

        if (!question) {
          throw new NotFoundException('Question not found');
        }

        let gradingStatus = GradingStatusEnum.UNGRADED;
        let point = 0;

        switch (question.questionType) {
          case QuestionTypeEnum.CHOICE:
            numberOfChoiceQuestions++;
            totalPointChoiceQuestions += question.maxPoint;

            point = this.calculateChoicePoints(question, answer.answers);
            if (point > 0) {
              numberOfCorrectChoiceAnswers++;
            } else {
              numberOfIncorrectChoiceAnswers++;
            }

            gainedPointChoiceQuestions += point;
            gradingStatus = GradingStatusEnum.GRADED;
            break;
          case QuestionTypeEnum.FILL:
            numberOfFillQuestions++;
            point = 0;
            break;
        }

        return this.progressExerciseQuestionService.store({
          progressExerciseId,
          questionId: answer.questionId,
          answers: answer.answers,
          gradingStatus,
          point,
        });
      }),
    );

    const percentage =
      (gainedPointChoiceQuestions / totalPointChoiceQuestions) * 100;
    const passed = percentage >= exercise.min_passing_percentage;
    const status =
      numberOfFillQuestions > 0 ? 'pending' : passed ? 'passed' : 'failed';

    return {
      numberOfChoiceQuestions,
      numberOfFillQuestions,
      totalPointChoiceQuestions,
      numberOfCorrectChoiceAnswers,
      numberOfIncorrectChoiceAnswers,
      gainedPointChoiceQuestions,
      status,
    };
  }

  private calculateChoicePoints(
    question: QuestionEntity,
    answers: string[],
  ): number {
    if (
      question.correctAnswers.length === answers.length &&
      question.correctAnswers.every((answer) => answers.includes(answer))
    ) {
      return question.maxPoint;
    }

    return 0;
  }
}
