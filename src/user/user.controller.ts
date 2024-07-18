import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { UserEntity } from 'src/entities';
import { UserService } from './user.service';
import { CustomResponse } from 'src/utils/customResponse';
import { CreateUserDto, UpdateUserDto } from 'src/dtos';
import { UserDto } from 'src/dtos/user/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async findAll() {
    const users: UserEntity[] = await this.userService.findAll();

    return new CustomResponse(HttpStatus.OK, 'Success', UserDto.plainToInstance(users));
  }

  @Get('/:id')
  async findById(@Param('id') id: string) {
    const user: UserEntity = await this.userService.findById(id);

    return new CustomResponse(HttpStatus.OK, 'Success', UserDto.plainToInstance(user));
  }

  @Post('/')
  async create(@Body() createUserDto: CreateUserDto) {
    const user: UserEntity = await this.userService.create(createUserDto);

    return new CustomResponse(HttpStatus.OK, 'Created a new user', UserDto.plainToInstance(user));
  }

  @Put('/:id')
  async updateById(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user: UserEntity = await this.userService.updateById(id, updateUserDto);

    return new CustomResponse(HttpStatus.OK, 'Updated a user', UserDto.plainToInstance(user));
  }

  @Delete('/:id')
  async deleteById(@Param('id') id: string) {
    await this.userService.deleteById(id);

    return new CustomResponse(HttpStatus.OK, 'Deleted a user');
  }
}
