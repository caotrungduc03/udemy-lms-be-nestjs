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
import { CreateQuestionDto, QuestionDto, UpdateQuestionDto } from 'src/dtos';
import { CustomResponse } from 'src/utils/customResponse';
import { IPagination } from 'src/utils/i.pagination';
import { Public } from 'src/utils/public.decorator';
import { RoleEnum } from 'src/utils/role.enum';
import { Roles } from 'src/utils/roles.decorator';
import { QuestionService } from './question.service';

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get('/')
  @Public()
  async find(@Query() queryObj: Object) {
    const [page, limit, total, questions] = await this.questionService.query(
      queryObj,
      {
        relations: ['exercise'],
      },
    );
    const results: IPagination<QuestionDto> = {
      page,
      limit,
      total,
      items: QuestionDto.plainToInstance(questions),
    };

    return new CustomResponse(HttpStatus.OK, 'Success', results);
  }

  @Get('/:id')
  @Public()
  async findById(@Param('id', ParseIntPipe) id: number) {
    const question = await this.questionService.findById(id, {
      relations: ['exercise', 'exercise.course', 'exercise.course.author'],
    });

    return new CustomResponse(
      HttpStatus.OK,
      'Success',
      QuestionDto.plainToInstance(question),
    );
  }

  @Post('/')
  @Roles(RoleEnum.PROFESSOR, RoleEnum.ADMIN)
  async create(
    @Req() request: Request,
    @Body() createQuestionDto: CreateQuestionDto,
  ) {
    const userReq = request['user'];
    const question = await this.questionService.create(
      createQuestionDto,
      userReq.userId,
    );

    return new CustomResponse(
      HttpStatus.OK,
      'Success',
      QuestionDto.plainToInstance(question),
    );
  }

  @Put('/:id')
  @Roles(RoleEnum.PROFESSOR, RoleEnum.ADMIN)
  async updateById(
    @Req() request: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    const userReq = request['user'];
    const question = await this.questionService.updateById(
      id,
      userReq.userId,
      updateQuestionDto,
    );

    return new CustomResponse(
      HttpStatus.OK,
      'Success',
      QuestionDto.plainToInstance(question),
    );
  }

  @Delete('/:id')
  @Roles(RoleEnum.PROFESSOR, RoleEnum.ADMIN)
  async deleteById(
    @Req() request: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const userReq = request['user'];
    await this.questionService.deleteById(id, userReq.userId);

    return new CustomResponse(HttpStatus.OK, 'Deleted a question');
  }
}
