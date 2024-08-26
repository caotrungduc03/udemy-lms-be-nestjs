import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { format } from 'date-fns';
import { CreateSubmission, ExerciseDto } from 'src/dtos';
import {
  GradingStatusEnum,
  QuestionEntity,
  QuestionTypeEnum,
} from 'src/entities';
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
  ): Promise<any> {
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

    const submissions = progressExercises.map((progressExercise) => {
      const { progressExercisesQuestions } = progressExercise;
      let totalQuestions = 0;
      let numberOfCorrectAnswers = 0;
      let numberOfIncorrectAnswers = 0;
      let numberOfPendingAnswers = 0;
      let totalPointQuestions = 0;
      let gainedPointQuestions = 0;

      progressExercisesQuestions.forEach((progressExercisesQuestion) => {
        if (progressExercisesQuestion.gradingStatus === 'ungraded') {
          numberOfPendingAnswers += 1;
        } else if (progressExercisesQuestion.gradingStatus === 'graded') {
          numberOfCorrectAnswers += 1;
          totalPointQuestions += progressExercisesQuestion.question.maxPoint;
          gainedPointQuestions += progressExercisesQuestion.point;
        } else {
          numberOfIncorrectAnswers += 1;
        }
        totalQuestions += 1;
      });

      const percentage = (gainedPointQuestions / totalPointQuestions) * 100;
      const passed = percentage >= exercise.min_passing_percentage;
      const status =
        numberOfPendingAnswers > 0 ? 'pending' : passed ? 'passed' : 'failed';

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
        passed,
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
  ): Promise<any> {
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

    let numberOfChoiceQuestions = 0;
    let numberOfFillQuestions = 0;
    let totalPointChoiceQuestions = 0;
    let numberOfCorrectChoiceAnswers = 0;
    let numberOfIncorrectChoiceAnswers = 0;
    let gainedPointChoiceQuestions = 0;

    await Promise.all(
      questions.map(async (question) => {
        const answer = submission.find((ans) => question.id === ans.questionId);

        if (!answer) {
          return this.progressExerciseQuestionService.store({
            progressExerciseId,
            questionId: question.id,
            answers: [],
            gradingStatus: GradingStatusEnum.GRADED,
            point: 0,
          });
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
