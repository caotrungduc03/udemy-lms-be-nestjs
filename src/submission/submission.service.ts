import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { format } from 'date-fns';
import {
  CreateSubmission,
  ExerciseDto,
  getSubmissionsResponseDto,
  SubmissionDto,
} from 'src/dtos';
import { QuestionEntity } from 'src/entities';
import {
  GradingStatusEnum,
  QuestionTypeEnum,
  SubmissionStatusEnum,
} from 'src/enums';
import { ProgressExerciseQuestionService } from 'src/progress-exercise-question/progress-exercise-question.service';
import { ProgressExerciseService } from 'src/progress-exercise/progress-exercise.service';
import { ProgressService } from 'src/progress/progress.service';

@Injectable()
export class SubmissionService {
  constructor(
    private readonly progressService: ProgressService,
    private readonly progressExerciseService: ProgressExerciseService,
    private readonly progressExerciseQuestionService: ProgressExerciseQuestionService,
  ) {}

  async getSubmissions(
    progressId: number,
    exerciseId: number,
    userId: number,
  ): Promise<getSubmissionsResponseDto> {
    const progress = await this.progressService.findByIdAndVerifyUser(
      progressId,
      userId,
      {
        relations: ['course', 'course.exercises'],
      },
    );
    const exercise = progress.course.exercises.find(
      (exercise) => exercise.id === exerciseId,
    );
    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    const progressExercises = await this.progressExerciseService.findAll({
      where: {
        progressId,
        exerciseId,
      },
      relations: [
        'progressExercisesQuestions',
        'progressExercisesQuestions.question',
      ],
    });

    const submissions: SubmissionDto[] = progressExercises
      .sort((a, b) => b.id - a.id)
      .map((progressExercise) => {
        const { progressExercisesQuestions } = progressExercise;
        let totalQuestions = 0;
        let numberOfCorrectAnswers = 0;
        let numberOfIncorrectAnswers = 0;
        let numberOfPendingAnswers = 0;
        let totalPointQuestions = 0;
        let gainedPointQuestions = 0;

        progressExercisesQuestions.forEach((progressExercisesQuestion) => {
          if (
            progressExercisesQuestion.gradingStatus ===
            GradingStatusEnum.UNGRADED
          ) {
            numberOfPendingAnswers += 1;
          } else {
            if (progressExercisesQuestion.point > 0) {
              numberOfCorrectAnswers += 1;
              gainedPointQuestions += progressExercisesQuestion.point;
            } else {
              numberOfIncorrectAnswers += 1;
            }
            totalQuestions += 1;
            totalPointQuestions += progressExercisesQuestion.question.maxPoint;
          }
        });

        const percentage =
          totalPointQuestions > 0
            ? (gainedPointQuestions / totalPointQuestions) * 100
            : 0;
        const passed = percentage >= exercise.minPassingPercentage;
        const status =
          numberOfPendingAnswers > 0
            ? SubmissionStatusEnum.PENDING
            : passed
              ? SubmissionStatusEnum.PASS
              : SubmissionStatusEnum.FAIL;

        return {
          progressExerciseId: progressExercise.id,
          tryCount: progressExercise.tryCount,
          totalQuestions,
          numberOfCorrectAnswers,
          numberOfIncorrectAnswers,
          numberOfPendingAnswers,
          totalPointQuestions,
          gainedPointQuestions,
          percentage,
          status,
          date: format(progressExercise.createdAt, 'MM-dd-yyyy HH:mm:ss'),
        };
      });

    return {
      exercise: ExerciseDto.plainToInstance(exercise),
      submissions,
    };
  }

  async createSubmission(
    createSubmission: CreateSubmission,
    userId: number,
  ): Promise<SubmissionDto> {
    const { progressExerciseId, submission } = createSubmission;
    const [progressExercise, existingSubmission] = await Promise.all([
      this.progressExerciseService.findByIdAndVerifyUser(
        progressExerciseId,
        userId,
        {
          relations: ['progress', 'exercise', 'exercise.questions'],
        },
      ),
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

    let totalQuestions = questions.length;
    let numberOfCorrectAnswers = 0;
    let numberOfIncorrectAnswers = 0;
    let numberOfPendingAnswers = 0;
    let totalPointQuestions = 0;
    let gainedPointQuestions = 0;

    await Promise.all(
      questions.map((question) => {
        const answer = submission.find((ans) => question.id === ans.questionId);

        if (!answer) {
          numberOfIncorrectAnswers++;
          totalPointQuestions += question.maxPoint;

          return this.progressExerciseQuestionService.store({
            progressExerciseId,
            questionId: question.id,
            answers: [],
            gradingStatus: GradingStatusEnum.GRADED,
            point: 0,
          });
        }

        let gradingStatus = '';
        let point = 0;

        switch (question.questionType) {
          case QuestionTypeEnum.MULTIPLE_CHOICE:
          case QuestionTypeEnum.SINGLE_CHOICE:
            totalPointQuestions += question.maxPoint;

            point = this.calculateChoicePoints(question, answer.answers);
            if (point > 0) {
              numberOfCorrectAnswers++;
            } else {
              numberOfIncorrectAnswers++;
            }

            gainedPointQuestions += point;
            gradingStatus = GradingStatusEnum.GRADED;
            break;
          case QuestionTypeEnum.SHORT_ANSWER:
            numberOfPendingAnswers++;
            gradingStatus = GradingStatusEnum.UNGRADED;
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

    const percentage = (gainedPointQuestions / totalPointQuestions) * 100;
    const passed = percentage >= exercise.minPassingPercentage;
    const status =
      numberOfPendingAnswers > 0
        ? SubmissionStatusEnum.PENDING
        : passed
          ? SubmissionStatusEnum.PASS
          : SubmissionStatusEnum.FAIL;

    return {
      progressExerciseId,
      tryCount: progressExercise.tryCount,
      totalQuestions,
      numberOfCorrectAnswers,
      numberOfIncorrectAnswers,
      numberOfPendingAnswers,
      totalPointQuestions,
      gainedPointQuestions,
      percentage,
      status,
      date: format(progressExercise.createdAt, 'MM-dd-yyyy HH:mm:ss'),
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
