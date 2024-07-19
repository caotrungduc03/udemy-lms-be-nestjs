import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';
import { CreateRoleDto, UpdateRoleDto } from 'src/dtos';
import { RoleEntity } from 'src/entities';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class RoleService extends BaseService<RoleEntity> {
  constructor(
    @InjectRepository(RoleEntity) private readonly roleRepository: Repository<RoleEntity>,
  ) {
    super(roleRepository);
  }

  async findAll(): Promise<RoleEntity[]> {
    return this.roleRepository.find();
  }

  async findById(id: number): Promise<RoleEntity> {
    const role = await this.roleRepository.findOneBy({ id });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }

  async create(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    const role = await this.roleRepository.findOne({
      where: {
        roleName: createRoleDto.roleName,
      },
    });

    if (role) {
      throw new BadRequestException('Role already exists');
    }

    return this.roleRepository.save(createRoleDto);
  }

  async updateById(id: number, updateRoleDto: UpdateRoleDto): Promise<RoleEntity> {
    const role = await this.findById(id);

    const updatedRole = await this.roleRepository.save({
      ...role,
      ...updateRoleDto,
    });

    return updatedRole;
  }

  async deleteById(id: number): Promise<RoleEntity> {
    const role = await this.findById(id);

    await this.roleRepository.delete(id);

    return role;
  }

  async findByName(roleName: string): Promise<RoleEntity> {
    const role = await this.roleRepository.findOne({ where: { roleName: ILike(`%${roleName}%`) } });

    return role;
  }
}
