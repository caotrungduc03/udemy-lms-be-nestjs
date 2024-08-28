import { ExerciseDto } from '../exercise/exercise.dto';
import { SubmissionDto } from './submission.dto';

export class getSubmissionsResponseDto {
  exercise: ExerciseDto;
  submissions: SubmissionDto[];
}
