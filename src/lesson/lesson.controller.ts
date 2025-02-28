import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { Roles } from 'src/decorators';
import {
  CreateLessonDto,
  findLessonsRequestDto,
  LessonDto,
  UpdateLessonDto,
} from 'src/dtos';
import { RoleEnum } from 'src/enums';
import { CustomResponse } from 'src/utils/customResponse';
import { Pagination } from 'src/utils/pagination';
import { LessonService } from './lesson.service';

@Controller('lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Get('/')
  @Roles(RoleEnum.PROFESSOR, RoleEnum.ADMIN)
  async find(@Query() query: findLessonsRequestDto) {
    const [page, limit, total, lessons] = await this.lessonService.query(query);

    const results: Pagination<LessonDto> = {
      page,
      limit,
      total,
      items: LessonDto.plainToInstance(lessons),
    };

    return new CustomResponse(HttpStatus.OK, 'Success', results);
  }

  @Get('/:id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    const lesson = await this.lessonService.findById(id);

    return new CustomResponse(
      HttpStatus.OK,
      'Success',
      LessonDto.plainToInstance(lesson, ['detail']),
    );
  }

  @Post('/')
  @Roles(RoleEnum.PROFESSOR, RoleEnum.ADMIN)
  async create(
    @Req() request: Request,
    @Body() createLessonDto: CreateLessonDto,
  ) {
    const userReq = request['user'];
    const lesson = await this.lessonService.create(
      userReq.userId,
      createLessonDto,
    );

    return new CustomResponse(
      HttpStatus.CREATED,
      'Created a new lesson',
      LessonDto.plainToInstance(lesson),
    );
  }

  @Put('/:id')
  @Roles(RoleEnum.PROFESSOR, RoleEnum.ADMIN)
  async updateById(
    @Req() request: Request,
    @Param('id') id: number,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    const userReq = request['user'];
    const lesson = await this.lessonService.updateById(
      id,
      userReq.userId,
      updateLessonDto,
    );

    return new CustomResponse(
      HttpStatus.OK,
      'Updated a lesson',
      LessonDto.plainToInstance(lesson),
    );
  }

  @Delete('/:id')
  @Roles(RoleEnum.PROFESSOR, RoleEnum.ADMIN)
  async deleteById(@Req() request: Request, @Param('id') id: number) {
    const userReq = request['user'];

    await this.lessonService.deleteById(id, userReq.userId);

    return new CustomResponse(HttpStatus.OK, 'Deleted a lesson');
  }
}
