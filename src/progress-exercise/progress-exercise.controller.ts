import { Body, Controller, HttpStatus, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { CreateProgressExerciseRequestDto } from 'src/dtos';
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
    @Body() createProgressExerciseRequestDto: CreateProgressExerciseRequestDto,
  ) {
    const userReq = request['user'];
    const result = await this.progressExerciseService.create(
      CreateProgressExerciseRequestDto.plainToClass(
        createProgressExerciseRequestDto,
      ),
      userReq.userId,
    );

    return new CustomResponse(
      HttpStatus.CREATED,
      'Created a new progress exercise',
      result,
    );
  }
}
