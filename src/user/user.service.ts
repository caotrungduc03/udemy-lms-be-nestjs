import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';
import { UserEntity } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class UserService extends BaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {
    super(userRepository);
  }

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(data: any): Promise<UserEntity> {
    if (data.password !== data.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const user = await this.userRepository.findOne({
      where: {
        email: data.email,
      },
    });
    if (user) {
      throw new BadRequestException('User already exists');
    }

    return this.userRepository.save(data);
  }

  async updateById(id: string, data: any): Promise<UserEntity> {
    const user = await this.findById(id);

    const updatedUser = await this.userRepository.save({
      ...user,
      ...data,
    });

    return updatedUser;
  }

  async deleteById(id: string): Promise<UserEntity> {
    const user = await this.findById(id);

    await this.userRepository.delete(id);

    return user;
  }
}
