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
import { CreateRoleDto, RoleDto, UpdateRoleDto } from 'src/dtos';
import { RoleEntity } from 'src/entities';
import { CustomResponse } from 'src/utils/customResponse';
import { Pagination } from 'src/utils/pagination';
import { RoleEnum } from 'src/utils/role.enum';
import { Roles } from 'src/utils/roles.decorator';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('/')
  @Roles(RoleEnum.ADMIN)
  async find(@Query() queryObj: Object) {
    const [page, limit, total, roles] = await this.roleService.query(queryObj);

    const results: Pagination<RoleDto> = {
      page,
      limit,
      total,
      items: RoleDto.plainToInstance(roles, ['admin']),
    };

    return new CustomResponse(HttpStatus.OK, 'Success', results);
  }

  @Get('/:id')
  @Roles(RoleEnum.ADMIN)
  async findById(@Param('id', ParseIntPipe) id: number) {
    const role: RoleEntity = await this.roleService.findById(id);

    return new CustomResponse(
      HttpStatus.OK,
      'Success',
      RoleDto.plainToInstance(role, ['admin']),
    );
  }

  @Post('/')
  @Roles(RoleEnum.ADMIN)
  async create(@Body() createRoleDto: CreateRoleDto) {
    const role: RoleEntity = await this.roleService.create(createRoleDto);

    return new CustomResponse(
      HttpStatus.CREATED,
      'Created a new role',
      RoleDto.plainToInstance(role, ['admin']),
    );
  }

  @Put('/:id')
  @Roles(RoleEnum.ADMIN)
  async updateById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    const role: RoleEntity = await this.roleService.updateById(
      id,
      updateRoleDto,
    );

    return new CustomResponse(
      HttpStatus.OK,
      'Updated a role',
      RoleDto.plainToInstance(role, ['admin']),
    );
  }

  @Delete('/:id')
  @Roles(RoleEnum.ADMIN)
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    await this.roleService.deleteById(id);

    return new CustomResponse(HttpStatus.OK, 'Deleted a role');
  }
}
