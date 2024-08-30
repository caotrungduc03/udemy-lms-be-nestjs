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
import { Public, Roles } from 'src/decorators';
import { CreateQuestionDto, QuestionDto, UpdateQuestionDto } from 'src/dtos';
import { RoleEnum } from 'src/enums';
import { CustomResponse } from 'src/utils/customResponse';
import { QuestionService } from './question.service';

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get('/:id')
  @Public()
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
