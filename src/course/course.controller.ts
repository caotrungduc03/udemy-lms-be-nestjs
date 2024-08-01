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
import { CourseDto, UpdateCourseDto } from 'src/dtos';
import { CreateCourseDto } from 'src/dtos/course/createCourse.dto';
import { CourseEntity } from 'src/entities';
import { CustomResponse } from 'src/utils/customResponse';
import { IPagination } from 'src/utils/i.pagination';
import { Public } from 'src/utils/public.decorator';
import { RoleEnum } from 'src/utils/role.enum';
import { Roles } from 'src/utils/roles.decorator';
import { CourseService } from './course.service';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get('/')
  @Public()
  async find(@Query() queryObj: Object) {
    const [page, limit, total, courses] = await this.courseService.query(
      queryObj,
      ['author', 'category'],
    );

    const results: IPagination<CourseDto> = {
      page,
      limit,
      total,
      items: CourseDto.plainToInstance(courses, ['public']),
    };

    return new CustomResponse(HttpStatus.OK, 'Success', results);
  }

  @Post('/')
  @Roles(RoleEnum.PROFESSOR)
  async create(
    @Req() request: Request,
    @Body() createCourseDto: CreateCourseDto,
  ) {
    const userReq = request['user'];
    const course: CourseEntity = await this.courseService.create({
      ...createCourseDto,
      authorId: userReq.userId,
    });

    return new CustomResponse(
      HttpStatus.CREATED,
      'Created a new course',
      CourseDto.plainToInstance(course),
    );
  }

  @Get('/:id')
  @Public()
  async findById(@Param('id', ParseIntPipe) id: number) {
    const course: CourseEntity = await this.courseService.findById(id, {
      relations: ['author', 'category', 'lessons'],
    });

    return new CustomResponse(
      HttpStatus.OK,
      'Success',
      CourseDto.plainToInstance(course, ['public']),
    );
  }

  @Put('/:id')
  @Roles(RoleEnum.PROFESSOR)
  async updateById(
    @Req() request: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    const userReq = request['user'];

    const course: CourseEntity = await this.courseService.updateById(id, {
      ...updateCourseDto,
      authorId: userReq.userId,
    });

    return new CustomResponse(
      HttpStatus.OK,
      'Updated a course',
      CourseDto.plainToInstance(course),
    );
  }

  @Delete('/:id')
  @Roles(RoleEnum.PROFESSOR)
  async delete(@Req() request: Request, @Param('id', ParseIntPipe) id: number) {
    const userReq = request['user'];

    await this.courseService.deleteById(id, userReq.userId);

    return new CustomResponse(HttpStatus.OK, 'Deleted a course');
  }
}
