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
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from 'src/dtos';
import { UserDto } from 'src/dtos/user/user.dto';
import { UserEntity } from 'src/entities';
import { CustomResponse } from 'src/utils/customResponse';
import { RoleEnum } from 'src/utils/role.enum';
import { Roles } from 'src/utils/roles.decorator';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(RoleEnum.ADMIN)
  @Get('/')
  async findAll() {
    const users: UserEntity[] = await this.userService.findAll();

    return new CustomResponse(HttpStatus.OK, 'Success', UserDto.plainToInstance(users));
  }

  @Get('/:id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    const user: UserEntity = await this.userService.findById(id);

    return new CustomResponse(HttpStatus.OK, 'Success', UserDto.plainToInstance(user));
  }

  @Post('/')
  async create(@Body() createUserDto: CreateUserDto) {
    const user: UserEntity = await this.userService.create(createUserDto);

    return new CustomResponse(HttpStatus.OK, 'Created a new user', UserDto.plainToInstance(user));
  }

  @Put('/:id')
  async updateById(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    const user: UserEntity = await this.userService.updateById(id, updateUserDto);

    return new CustomResponse(HttpStatus.OK, 'Updated a user', UserDto.plainToInstance(user));
  }

  @Delete('/:id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    await this.userService.deleteById(id);

    return new CustomResponse(HttpStatus.OK, 'Deleted a user');
  }
}
