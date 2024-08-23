import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateProgressDto, ProgressDto } from 'src/dtos';
import { CustomResponse } from 'src/utils/customResponse';
import { Pagination } from 'src/utils/pagination';
import { RoleEnum } from 'src/utils/role.enum';
import { Roles } from 'src/utils/roles.decorator';
import { ProgressService } from './progress.service';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get('/')
  async find(@Req() request: Request, @Query() query: Object) {
    const userReq = request['user'];

    const [page, limit, total, progressDtos] =
      await this.progressService.queryProgress({
        ...query,
        userId: userReq.userId,
      });
    const results: Pagination<any> = {
      page,
      limit,
      total,
      items: progressDtos,
    };

    return new CustomResponse(
      HttpStatus.OK,
      'Progress retrieved successfully',
      results,
    );
  }

  @Get('/courses/:courseId')
  async findOneByCourseId(
    @Req() request: Request,
    @Param('courseId') courseId: number,
  ) {
    const userReq = request['user'];
    const progressDto = await this.progressService.findOneByCourseId(
      courseId,
      userReq.userId,
    );

    return new CustomResponse(
      HttpStatus.OK,
      'Progress retrieved successfully',
      progressDto,
    );
  }

  @Get('/:id')
  async findById(@Req() request: Request, @Param('id') id: number) {
    const userReq = request['user'];

    const progress = await this.progressService.findByIdAndVerifyUser(
      id,
      userReq.userId,
      {
        relations: ['course', 'progressLessons', 'progressExercises'],
      },
    );

    return new CustomResponse(
      HttpStatus.OK,
      'Progress retrieved successfully',
      ProgressDto.plainToInstance(progress, ['student']),
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

  @Patch('/:id/status')
  @Roles(RoleEnum.PROFESSOR, RoleEnum.ADMIN)
  async updateById(@Req() request: Request, @Param('id') id: number) {
    const userReq = request['user'];
    const progress = await this.progressService.updateStatusById(
      id,
      userReq.userId,
    );

    return new CustomResponse(
      HttpStatus.OK,
      'Progress updated successfully',
      ProgressDto.plainToInstance(progress),
    );
  }
}
