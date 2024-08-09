import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import {
  CreateProgressExerciseDto,
  CreateSubmission,
  ProgressExerciseDto,
} from 'src/dtos';
import { CustomResponse } from 'src/utils/customResponse';
import { ProgressExerciseService } from './progress-exercise.service';

@Controller('progress-exercises')
export class ProgressExerciseController {
  constructor(
    private readonly progressExerciseService: ProgressExerciseService,
  ) {}

  @Post('/')
  async create(
    @Req() request: Request,
    @Body() createProgressExerciseDto: CreateProgressExerciseDto,
  ) {
    const userReq = request['user'];
    const progressExercise = await this.progressExerciseService.create(
      createProgressExerciseDto,
      userReq.userId,
    );

    return new CustomResponse(
      HttpStatus.CREATED,
      'Created a new progress exercise',
      ProgressExerciseDto.plainToInstance(progressExercise),
    );
  }

  @Post('/submissions')
  async createSubmission(
    @Req() request: Request,
    @Body() createSubmission: CreateSubmission,
  ) {
    const userReq = request['user'];
    const submission = await this.progressExerciseService.createSubmission(
      createSubmission,
      userReq.userId,
    );

    return new CustomResponse(HttpStatus.CREATED, submission);
  }

  @Get('/submissions/:id')
  async getSubmission(@Req() request: Request, @Param('id') id: number) {
    const userReq = request['user'];

    const submission = await this.progressExerciseService.getSubmission(
      id,
      userReq.userId,
    );

    return new CustomResponse(
      HttpStatus.OK,
      'Submission retrieved successfully',
      submission,
    );
  }
}
