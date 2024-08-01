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
import { CreateLessonDto, LessonDto, UpdateLessonDto } from 'src/dtos';
import { CustomResponse } from 'src/utils/customResponse';
import { IPagination } from 'src/utils/i.pagination';
import { Public } from 'src/utils/public.decorator';
import { RoleEnum } from 'src/utils/role.enum';
import { Roles } from 'src/utils/roles.decorator';
import { LessonService } from './lesson.service';

@Controller('lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Get('/')
  @Public()
  async find(@Query() queryObj: Object) {
    const [page, limit, total, lessons] =
      await this.lessonService.query(queryObj);

    const results: IPagination<LessonDto> = {
      page,
      limit,
      total,
      items: LessonDto.plainToInstance(lessons),
    };

    return new CustomResponse(HttpStatus.OK, 'Success', results);
  }

  @Post('/')
  @Public()
  async create(@Body() createLessonDto: CreateLessonDto) {
    const lesson = await this.lessonService.create(createLessonDto);

    return new CustomResponse(
      HttpStatus.CREATED,
      'Created a new lesson',
      LessonDto.plainToInstance(lesson),
    );
  }

  @Get('/:id')
  @Public()
  async findById(@Param('id', ParseIntPipe) id: number) {
    const lesson = await this.lessonService.findById(id, {
      relations: ['course'],
    });

    return new CustomResponse(
      HttpStatus.OK,
      'Success',
      LessonDto.plainToInstance(lesson),
    );
  }

  @Put('/:id')
  @Roles(RoleEnum.PROFESSOR)
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
  @Roles(RoleEnum.PROFESSOR)
  async deleteById(@Req() request: Request, @Param('id') id: number) {
    const userReq = request['user'];

    await this.lessonService.deleteById(id, userReq.userId);

    return new CustomResponse(HttpStatus.OK, 'Deleted a lesson');
  }
}