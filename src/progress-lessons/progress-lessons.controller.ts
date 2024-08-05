import { Body, Controller, HttpStatus, Post, Req } from '@nestjs/common';
import { CreateProgressLessonsDto, ProgressLessonsDto } from 'src/dtos';
import { CustomResponse } from 'src/utils/customResponse';
import { ProgressLessonsService } from './progress-lessons.service';

@Controller('progress-lessons')
export class ProgressLessonsController {
  constructor(
    private readonly progressLessonsService: ProgressLessonsService,
  ) {}

  @Post('/')
  async create(
    @Req() request: Request,
    @Body() createProgressLessonsDto: CreateProgressLessonsDto,
  ) {
    const userReq = request['user'];

    const progressLessons = await this.progressLessonsService.create(
      createProgressLessonsDto,
      userReq.userId,
    );

    return new CustomResponse(
      HttpStatus.CREATED,
      'Created a new progress lessons',
      ProgressLessonsDto.plainToInstance(progressLessons),
    );
  }
}
