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
} from '@nestjs/common';
import { Roles, User } from 'src/decorators';
import {
  CreateQuestionDto,
  FindQuestionsRequestDto,
  QuestionDto,
  UpdateQuestionDto,
  UpdateQuestionsDto,
} from 'src/dtos';
import { RoleEnum } from 'src/enums';
import { CustomResponse } from 'src/utils/customResponse';
import { Pagination } from 'src/utils/pagination';
import { QuestionService } from './question.service';

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get('/')
  @Roles(RoleEnum.PROFESSOR, RoleEnum.ADMIN)
  async find(@Query() query: FindQuestionsRequestDto) {
    const [page, limit, total, questions] =
      await this.questionService.query(query);

    const results: Pagination<QuestionDto> = {
      page,
      limit,
      total,
      items: QuestionDto.plainToInstance(questions),
    };

    return new CustomResponse(HttpStatus.OK, 'Success', results);
  }

  @Get('/:id')
  @Roles(RoleEnum.PROFESSOR, RoleEnum.ADMIN)
  async findById(@Param('id', ParseIntPipe) id: number) {
    const question = await this.questionService.findById(id);

    return new CustomResponse(
      HttpStatus.OK,
      'Success',
      QuestionDto.plainToInstance(question),
    );
  }

  @Post('/')
  @Roles(RoleEnum.PROFESSOR, RoleEnum.ADMIN)
  async create(
    @User('userId') userId: number,
    @Body() createQuestionDto: CreateQuestionDto,
  ) {
    const question = await this.questionService.create(
      createQuestionDto,
      userId,
    );

    return new CustomResponse(
      HttpStatus.CREATED,
      'Success',
      QuestionDto.plainToInstance(question),
    );
  }

  @Put('/:id')
  @Roles(RoleEnum.PROFESSOR, RoleEnum.ADMIN)
  async updateById(
    @User('userId') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    const question = await this.questionService.updateById(
      id,
      userId,
      updateQuestionDto,
    );

    return new CustomResponse(
      HttpStatus.OK,
      'Success',
      QuestionDto.plainToInstance(question),
    );
  }

  @Put('/exercises/:exerciseId')
  @Roles(RoleEnum.PROFESSOR, RoleEnum.ADMIN)
  async updateByExerciseId(
    @User('userId') userId: number,
    @Param('exerciseId', ParseIntPipe) exerciseId: number,
    @Body() updateQuestionsDto: UpdateQuestionsDto,
  ) {
    const question = await this.questionService.updateByExerciseId(
      exerciseId,
      updateQuestionsDto,
      userId,
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
    @User('userId') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.questionService.deleteById(id, userId);

    return new CustomResponse(HttpStatus.OK, 'Deleted a question');
  }
}
