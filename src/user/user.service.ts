import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';
import {
  CreateUserDto,
  RegisterDto,
  UpdateProfileDto,
  UpdateUserDto,
} from 'src/dtos';
import { UserEntity } from 'src/entities';
import { RoleService } from 'src/role/role.service';
import { encodePassword } from 'src/utils/bcrypt';
import { FindOptions } from 'src/utils/options';
import { pickFields } from 'src/utils/pickFields';
import { Repository } from 'typeorm';

@Injectable()
export class UserService extends BaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly roleService: RoleService,
  ) {
    super(userRepository);
  }

  async findById(id: number, options?: FindOptions): Promise<UserEntity> {
    const { relations = [] } = options || {};

    const user = await this.findOne({
      where: { id },
      relations,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(
    createUserDto: CreateUserDto | RegisterDto,
  ): Promise<UserEntity> {
    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const newUser = new UserEntity();
    newUser.email = createUserDto.email.toLowerCase();
    const user = await this.findOne({
      where: {
        email: newUser.email,
      },
    });
    if (user) {
      throw new BadRequestException('User already exists');
    }

    if (!createUserDto['roleId']) {
      const defaultRole = await this.roleService.findByName('STUDENT');
      newUser.role = defaultRole;
    }

    newUser.password = encodePassword(createUserDto.password);

    return this.store({
      ...createUserDto,
      ...newUser,
    });
  }

  async updateById(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const updateData = pickFields(updateUserDto, [
      'fullName',
      'phoneNumber',
      'avatar',
      'roleId',
      'status',
    ]);
    const user = await this.findById(id);

    if (updateData.roleId !== user.roleId) {
      const role = await this.roleService.findById(updateData.roleId);
      user.role = role;
    }

    return this.store({
      ...user,
      ...updateData,
    });
  }

  async deleteById(id: number): Promise<UserEntity> {
    const user = await this.findById(id);

    await this.delete(id);

    return user;
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return this.findOne({
      where: { email },
      relations: ['role'],
      select: [
        'id',
        'email',
        'password',
        'fullName',
        'phoneNumber',
        'avatar',
        'status',
        'lastLogin',
        'roleId',
      ],
    });
  }

  async updateProfile(
    id: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<UserEntity> {
    const updateData = pickFields(updateProfileDto, [
      'fullName',
      'phoneNumber',
      'avatar',
    ]);
    const user = await this.findById(id);

    if (!updateData.avatar) {
      updateData.avatar = user.avatar;
    }

    return this.store({
      ...user,
      ...updateProfileDto,
    });
  }

  async checkAdminRole(id: number): Promise<boolean> {
    const user = await this.findById(id, { relations: ['role'] });

    return user.role?.roleName === 'ADMIN';
  }
}
