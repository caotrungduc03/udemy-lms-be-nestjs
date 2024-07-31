import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';
import { CreateRoleDto, UpdateRoleDto } from 'src/dtos';
import { RoleEntity } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService extends BaseService<RoleEntity> {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {
    super(roleRepository);
  }

  async findById(id: number): Promise<RoleEntity> {
    const role = await this.findOne({ where: { id } });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }

  async create(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    const role = await this.findByName(createRoleDto.roleName);
    if (role) {
      throw new BadRequestException('Role already exists');
    }

    return this.store(createRoleDto);
  }

  async updateById(
    id: number,
    updateRoleDto: UpdateRoleDto,
  ): Promise<RoleEntity> {
    const role = await this.findById(id);

    return this.store({
      ...role,
      ...updateRoleDto,
    });
  }

  async deleteById(id: number): Promise<RoleEntity> {
    const role = await this.findById(id);

    await this.delete(id);

    return role;
  }

  async findByName(roleName: string): Promise<RoleEntity> {
    return this.findOne({ where: { roleName } });
  }
}
