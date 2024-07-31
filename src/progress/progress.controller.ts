import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateProgressDto, ProgressDto } from 'src/dtos';
import { CustomResponse } from 'src/utils/customResponse';
import { IPagination } from 'src/utils/i.pagination';
import { ProgressService } from './progress.service';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get('/')
  async find(@Req() request: Request, @Query() queryObj: Object) {
    const userReq = request['user'];

    const [page, limit, total, progress] = await this.progressService.query(
      {
        ...queryObj,
        userId: userReq.userId,
      },
      ['course'],
    );
    const results: IPagination<ProgressDto> = {
      page,
      limit,
      total,
      items: ProgressDto.plainToInstance(progress, ['student']),
    };

    return new CustomResponse(
      HttpStatus.OK,
      'Progress retrieved successfully',
      results,
    );
  }

  @Post('/')
  async create(
    @Req() request: Request,
    @Body() createProgressDto: CreateProgressDto,
  ) {
    const userReq = request['user'];

    const progress = await this.progressService.create({
      ...createProgressDto,
      userId: userReq.userId,
    });
    return new CustomResponse(
      HttpStatus.CREATED,
      'Progress created successfully',
      ProgressDto.plainToInstance(progress),
    );
  }

  @Get('/courses/:courseId')
  async findStudentByCourseId(
    @Req() request: Request,
    @Param('courseId') courseId: number,
  ) {
    const userReq = request['user'];
    const [page, limit, total, items] =
      await this.progressService.findStudentByCourseId(
        courseId,
        userReq.userId,
      );

    const results: IPagination<ProgressDto> = {
      page,
      limit,
      total,
      items: ProgressDto.plainToInstance(items),
    };

    return new CustomResponse(
      HttpStatus.OK,
      'Progress retrieved successfully',
      results,
    );
  }

  @Get('/:id')
  async findByIdAndVerifyUser(
    @Req() request: Request,
    @Param('id') id: number,
  ) {
    const userReq = request['user'];
    const progress = await this.progressService.findByIdAndVerifyUser(
      userReq.userId,
      id,
    );
    return new CustomResponse(
      HttpStatus.OK,
      'Progress retrieved successfully',
      ProgressDto.plainToInstance(progress, ['student']),
    );
  }

  @Delete('/:id')
  async delete(@Req() request: Request, @Param('id') id: number) {
    const userReq = request['user'];
    await this.progressService.deleteById(id, userReq.userId);

    return new CustomResponse(HttpStatus.OK, 'Deleted a progress');
  }
}
