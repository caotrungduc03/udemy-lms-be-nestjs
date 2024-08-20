import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { CourseDto, UpdateCourseDto } from 'src/dtos';
import { CreateCourseDto } from 'src/dtos/course/createCourse.dto';
import { CourseEntity } from 'src/entities';
import { CustomResponse } from 'src/utils/customResponse';
import { Pagination } from 'src/utils/pagination';
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
      {
        ...queryObj,
      },
      {
        relations: ['author', 'category'],
      },
    );

    const results: Pagination<CourseDto> = {
      page,
      limit,
      total,
      items: CourseDto.plainToInstance(courses),
    };

    return new CustomResponse(HttpStatus.OK, 'Success', results);
  }

  @Get('/search')
  @Public()
  async search(@Query() queryObj: Object) {
    const [page, limit, total, courses] = await this.courseService.search(
      {
        ...queryObj,
        columns: ['courseName', 'description'],
      },
      {
        relations: ['author', 'category'],
      },
    );

    const results: Pagination<CourseDto> = {
      page,
      limit,
      total,
      items: CourseDto.plainToInstance(courses),
    };

    return new CustomResponse(HttpStatus.OK, 'Success', results);
  }

  @Get('/:id')
  @Public()
  async findById(@Param('id', ParseIntPipe) id: number) {
    const course = await this.courseService.findById(id, {
      relations: ['author', 'category', 'lessons', 'exercises'],
    });

    return new CustomResponse(
      HttpStatus.OK,
      'Success',
      CourseDto.plainToInstance(course),
    );
  }

  @Post('/')
  @Roles(RoleEnum.PROFESSOR, RoleEnum.ADMIN)
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

  @Put('/:id')
  @Roles(RoleEnum.PROFESSOR, RoleEnum.ADMIN)
  async updateById(
    @Req() request: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    const userReq = request['user'];

    const course = await this.courseService.updateById(id, {
      ...updateCourseDto,
      authorId: userReq.userId,
    });

    return new CustomResponse(
      HttpStatus.OK,
      'Updated a course',
      CourseDto.plainToInstance(course),
    );
  }

  @Patch(':id/status')
  @Roles(RoleEnum.PROFESSOR, RoleEnum.ADMIN)
  async updateStatus(
    @Req() request: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const userReq = request['user'];
    const course = await this.courseService.updateStatusById(
      id,
      userReq.userId,
    );

    return new CustomResponse(
      HttpStatus.OK,
      'Updated a course',
      CourseDto.plainToInstance(course),
    );
  }

  @Delete('/:id')
  @Roles(RoleEnum.PROFESSOR, RoleEnum.ADMIN)
  async delete(@Req() request: Request, @Param('id', ParseIntPipe) id: number) {
    const userReq = request['user'];

    await this.courseService.deleteById(id, userReq.userId);

    return new CustomResponse(HttpStatus.OK, 'Deleted a course');
  }
}
