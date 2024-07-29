import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginRequestDto, LoginResponseDto, UserDto } from 'src/dtos';
import { UserEntity } from 'src/entities';
import { UserService } from 'src/user/user.service';
import { comparePassword } from 'src/utils/bcrypt';
import { JwtPayload } from 'src/utils/i.jwtPayload';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginRequestDto: LoginRequestDto): Promise<LoginResponseDto> {
    loginRequestDto.email = loginRequestDto.email.toLowerCase();
    const user = await this.userService.findByEmail(loginRequestDto.email);
    if (!user) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    if (!user.status) {
      throw new UnauthorizedException('Your account is not active');
    }

    const isMatch = comparePassword(loginRequestDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    user.lastLogin = new Date();

    await this.userRepository.save(user);

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      user: UserDto.plainToInstance(user),
      accessToken,
    };
  }
}
