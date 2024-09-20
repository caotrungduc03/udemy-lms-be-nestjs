import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { User } from 'src/decorators';
import { CreateSubmission } from 'src/dtos';
import { CustomResponse } from 'src/utils/customResponse';
import { SubmissionService } from './submission.service';

@Controller('submissions')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Get('/')
  async getSubmissions(
    @User('userId') userId: number,
    @Query('progressId', ParseIntPipe) progressId: number,
    @Query('exerciseId', ParseIntPipe) exerciseId: number,
  ) {
    const result = await this.submissionService.getSubmissions(
      progressId,
      exerciseId,
      userId,
    );

    return new CustomResponse(HttpStatus.OK, 'Success', result);
  }

  @Get('/:progressExerciseId')
  async getSubmissionDetail(
    @User('userId') userId: number,
    @Param('progressExerciseId') id: number,
  ) {
    const result = await this.submissionService.getSubmissionDetail(id, userId);

    return new CustomResponse(
      HttpStatus.OK,
      'Get progress exercise successfully',
      result,
    );
  }

  @Post('/')
  async createSubmission(
    @Req() request: Request,
    @Body() createSubmission: CreateSubmission,
  ) {
    const userReq = request['user'];
    const submission = await this.submissionService.createSubmission(
      createSubmission,
      userReq.userId,
    );

    return new CustomResponse(HttpStatus.CREATED, 'Created', submission);
  }
}
