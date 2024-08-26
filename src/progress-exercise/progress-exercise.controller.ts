import { Body, Controller, HttpStatus, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { CreateProgressExerciseDto, ProgressExerciseDto } from 'src/dtos';
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
}
