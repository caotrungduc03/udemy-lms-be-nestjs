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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CourseDto, UpdateCourseDto } from 'src/dtos';
import { CreateCourseDto } from 'src/dtos/course/createCourse.dto';
import { CustomParseFilePipe } from 'src/utils/customParseFile.pipe';
import { CustomResponse } from 'src/utils/customResponse';
import { Pagination } from 'src/utils/pagination';
import { Public } from 'src/utils/public.decorator';
import { RoleEnum } from 'src/utils/role.enum';
import { Roles } from 'src/utils/roles.decorator';
import { CourseService } from './course.service';

@Controller('courses')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get('/')
  @Public()
  async find(@Query() query: Object) {
    const [page, limit, total, courses] = await this.courseService.query(
      query,
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
  async search(@Query() query: Object) {
    const [page, limit, total, courses] = await this.courseService.search(
      {
        ...query,
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
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Req() request: Request,
    @UploadedFile(new CustomParseFilePipe()) file: Express.Multer.File,
    @Body() createCourseDto: CreateCourseDto,
  ) {
    const userReq = request['user'];

    let imageUpload = null;
    if (file) {
      imageUpload = await this.cloudinaryService.uploadFile(file);
      createCourseDto.coverImage = imageUpload.url;
    }
    const course = await this.courseService.create(
      CreateCourseDto.plainToClass({
        ...createCourseDto,
        authorId: userReq.userId,
      }),
    );

    return new CustomResponse(
      HttpStatus.CREATED,
      'Created a new course',
      CourseDto.plainToInstance(course),
    );
  }

  @Put('/:id')
  @Roles(RoleEnum.PROFESSOR, RoleEnum.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async updateById(
    @Req() request: Request,
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(new CustomParseFilePipe()) file: Express.Multer.File,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    const userReq = request['user'];
    let imageUpload = null;
    if (file) {
      imageUpload = await this.cloudinaryService.uploadFile(file);
      updateCourseDto.coverImage = imageUpload.url;
    }
    const course = await this.courseService.updateById(
      id,
      UpdateCourseDto.plainToClass({
        ...updateCourseDto,
        authorId: userReq.userId,
      }),
    );

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
