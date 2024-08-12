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
import { Request } from 'express';
import { ExerciseDto, UpdateExerciseDto } from 'src/dtos';
import { CustomResponse } from 'src/utils/customResponse';
import { RoleEnum } from 'src/utils/role.enum';
import { Roles } from 'src/utils/roles.decorator';
import { CreateExerciseDto } from './../dtos/exercise/createExercise.dto';
import { ExerciseService } from './exercise.service';

@Controller('exercises')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Get('/:id')
  async findById(@Param('id') id: number) {
    const exercise = await this.exerciseService.findById(id, {
      relations: ['questions'],
    });

    return new CustomResponse(
      HttpStatus.OK,
      'Success',
      ExerciseDto.plainToInstance(exercise),
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