import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto, RegisterDto } from 'src/dtos';
import { UserEntity } from 'src/entities';
import { UserService } from 'src/user/user.service';
import { comparePassword } from 'src/utils/bcrypt';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    private readonly userService: UserService,
  ) {}

  async register(registerDto: RegisterDto): Promise<UserDto> {
    const user = await this.userService.create(registerDto);

    return UserDto.plainToInstance(user);
  }

  async login(loginDto: LoginDto): Promise<UserEntity> {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const isMatch = comparePassword(loginDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    user.lastLogin = new Date();

    await this.userRepository.save(user);

    return user;
  }
}
