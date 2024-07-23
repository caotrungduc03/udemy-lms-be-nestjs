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
  Req,
} from '@nestjs/common';
import { CourseDto, UpdateCourseDto } from 'src/dtos';
import { CreateCourseDto } from 'src/dtos/course/createCourse.dto';
import { CourseEntity } from 'src/entities';
import { CustomResponse } from 'src/utils/customResponse';
import { Public } from 'src/utils/public.decorator';
import { RoleEnum } from 'src/utils/role.enum';
import { Roles } from 'src/utils/roles.decorator';
import { CourseService } from './course.service';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get('/all')
  @Public()
  async findAll() {
    const courses: CourseEntity[] = await this.courseService.findAll();

    return new CustomResponse(HttpStatus.OK, 'Success', CourseDto.plainToInstance(courses));
  }

  @Post('/')
  @Roles(RoleEnum.ADMIN, RoleEnum.PROFESSOR)
  async create(@Req() request: Request, @Body() createCourseDto: CreateCourseDto) {
    const userReq = request['user'];
    const course: CourseEntity = await this.courseService.create({
      ...createCourseDto,
      authorId: userReq.userId,
    });

    return new CustomResponse(
      HttpStatus.OK,
      'Created a new course',
      CourseDto.plainToInstance(course),
    );
  }

  @Get('/:id')
  @Public()
  async findById(@Param('id', ParseIntPipe) id: number) {
    const course: CourseEntity = await this.courseService.findById(id);

    return new CustomResponse(HttpStatus.OK, 'Success', CourseDto.plainToInstance(course));
  }

  @Put('/:id')
  @Roles(RoleEnum.ADMIN, RoleEnum.PROFESSOR)
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

    return new CustomResponse(HttpStatus.OK, 'Updated a course', CourseDto.plainToInstance(course));
  }

  @Delete('/:id')
  @Roles(RoleEnum.ADMIN, RoleEnum.PROFESSOR)
  async delete(@Req() request: Request, @Param('id', ParseIntPipe) id: number) {
    const userReq = request['user'];

    await this.courseService.deleteById(id, userReq.userId);

    return new CustomResponse(HttpStatus.OK, 'Deleted a course');
  }
}
