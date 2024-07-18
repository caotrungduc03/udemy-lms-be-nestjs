import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';
import { CreateUserDto, UpdateUserDto } from 'src/dtos';
import { UserEntity } from 'src/entities';
import { RoleService } from 'src/role/role.service';
import { encodePassword } from 'src/utils/bcrypt';
import { Repository } from 'typeorm';

@Injectable()
export class UserService extends BaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    private readonly roleService: RoleService,
  ) {
    super(userRepository);
  }

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const user = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    if (user) {
      throw new BadRequestException('User already exists');
    }

    createUserDto.password = encodePassword(createUserDto.password);

    const createdUser = await this.userRepository.save(createUserDto);

    return createdUser;
  }

  async updateById(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const { roleId, ...remainingData } = updateUserDto;
    const user = await this.findById(id);

    const role = await this.roleService.findById(roleId);

    const updatedUser = await this.userRepository.save({
      ...user,
      ...remainingData,
      role,
    });

    return updatedUser;
  }

  async deleteById(id: number): Promise<UserEntity> {
    const user = await this.findById(id);

    await this.userRepository.delete(id);

    return user;
  }
}
