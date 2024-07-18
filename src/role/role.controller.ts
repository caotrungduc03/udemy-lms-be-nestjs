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
import { CreateRoleDto, RoleDto, UpdateRoleDto } from 'src/dtos';
import { RoleEntity } from 'src/entities';
import { CustomResponse } from 'src/utils/customResponse';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('/')
  async findAll() {
    const roles: RoleEntity[] = await this.roleService.findAll();

    return new CustomResponse(HttpStatus.OK, 'Success', RoleDto.plainToInstance(roles));
  }

  @Get('/:id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    const role: RoleEntity = await this.roleService.findById(id);

    return new CustomResponse(HttpStatus.OK, 'Success', RoleDto.plainToInstance(role));
  }

  @Post('/')
  async create(@Body() createRoleDto: CreateRoleDto) {
    const role: RoleEntity = await this.roleService.create(createRoleDto);

    return new CustomResponse(HttpStatus.OK, 'Created a new role', RoleDto.plainToInstance(role));
  }

  @Put('/:id')
  async updateById(@Param('id', ParseIntPipe) id: number, @Body() updateRoleDto: UpdateRoleDto) {
    const role: RoleEntity = await this.roleService.updateById(id, updateRoleDto);

    return new CustomResponse(HttpStatus.OK, 'Updated a role', RoleDto.plainToInstance(role));
  }

  @Delete('/:id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    await this.roleService.deleteById(id);

    return new CustomResponse(HttpStatus.OK, 'Deleted a role');
  }
}
