import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CustomResponse } from 'src/utils/customResponse';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async findAll() {
    const users = await this.userService.findAll();

    return new CustomResponse(HttpStatus.OK, 'Success', users);
  }

  @Get('/:id')
  async findById(@Param('id') id: string) {
    const user: any = await this.userService.findById(id);

    return new CustomResponse(HttpStatus.OK, 'Success', user);
  }

  @Post('/')
  async create(@Body() data: any) {
    const user = await this.userService.create(data);

    return new CustomResponse(HttpStatus.OK, 'Created a new user', user);
  }

  @Put('/:id')
  async updateById(@Param('id') id: string, @Body() data: any) {
    const user = await this.userService.updateById(id, data);

    return new CustomResponse(HttpStatus.OK, 'Updated a user', user);
  }

  @Delete('/:id')
  async deleteById(@Param('id') id: string) {
    await this.userService.deleteById(id);

    return new CustomResponse(HttpStatus.OK, 'Deleted a user');
  }
}
