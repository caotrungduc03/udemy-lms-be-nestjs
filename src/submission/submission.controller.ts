import {
  Body,
  Controller,
  Get,
  HttpStatus,
  ParseIntPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { CreateSubmission } from 'src/dtos';
import { CustomResponse } from 'src/utils/customResponse';
import { User } from 'src/utils/user.decorator';
import { SubmissionService } from './submission.service';

@Controller('submissions')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Get('/')
  async getSubmissions(
    @User() user: any,
    @Query('progressId', ParseIntPipe) progressId: number,
    @Query('exerciseId', ParseIntPipe) exerciseId: number,
  ) {
    const result = await this.submissionService.getSubmissions(
      progressId,
      exerciseId,
      user.userId,
    );

    return new CustomResponse(HttpStatus.OK, 'Success', result);
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
