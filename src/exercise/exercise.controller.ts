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
import { Request } from 'express';
import { Roles } from 'src/decorators';
import {
  CreateExerciseDto,
  ExerciseDto,
  FindExercisesRequestDto,
  UpdateExerciseDto,
} from 'src/dtos';
import { RoleEnum } from 'src/enums';
import { CustomResponse } from 'src/utils/customResponse';
import { Pagination } from 'src/utils/pagination';
import { ExerciseService } from './exercise.service';

@Controller('exercises')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Get('/')
  @Roles(RoleEnum.PROFESSOR, RoleEnum.ADMIN)
  async find(@Query() query: FindExercisesRequestDto) {
    const [page, limit, total, exercises] =
      await this.exerciseService.query(query);

    const results: Pagination<ExerciseDto> = {
      page,
      limit,
      total,
      items: ExerciseDto.plainToInstance(exercises),
    };

    return new CustomResponse(HttpStatus.OK, 'Success', results);
  }

  @Get('/:id')
  async findById(@Param('id') id: number) {
    const exercise = await this.exerciseService.findById(id, {
      relations: ['questions'],
    });

    return new CustomResponse(
      HttpStatus.OK,
      'Success',
      ExerciseDto.plainToInstance(exercise, ['detail']),
    );
  }

  @Post('/')
  @Roles(RoleEnum.PROFESSOR, RoleEnum.ADMIN)
  async create(
    @Req() request: Request,
    @Body() createExerciseDto: CreateExerciseDto,
  ) {
    const userReq = request['user'];

    const exercise = await this.exerciseService.create(
      createExerciseDto,
      userReq.userId,
    );

    return new CustomResponse(
      HttpStatus.CREATED,
      'Success',
      ExerciseDto.plainToInstance(exercise),
    );
  }

  @Put('/:id')
  @Roles(RoleEnum.PROFESSOR, RoleEnum.ADMIN)
  async updateById(
    @Req() request: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExerciseDto: UpdateExerciseDto,
  ) {
    const userReq = request['user'];

    const exercise = await this.exerciseService.updateById(
      id,
      userReq.userId,
      updateExerciseDto,
    );

    return new CustomResponse(
      HttpStatus.OK,
      'Updated a exercise',
      ExerciseDto.plainToInstance(exercise),
    );
  }

  @Delete('/:id')
  @Roles(RoleEnum.PROFESSOR, RoleEnum.ADMIN)
  async deleteById(@Req() request: Request, @Param('id') id: number) {
    const userReq = request['user'];

    await this.exerciseService.deleteById(id, userReq.userId);

    return new CustomResponse(HttpStatus.OK, 'Deleted a exercise');
  }
}
