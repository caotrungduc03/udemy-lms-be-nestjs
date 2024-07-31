import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginRequestDto, LoginResponseDto, UserDto } from 'src/dtos';
import { UserService } from 'src/user/user.service';
import { comparePassword } from 'src/utils/bcrypt';
import { JwtPayload } from './auth.guard';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginRequestDto: LoginRequestDto): Promise<LoginResponseDto> {
    let { email, password } = loginRequestDto;
    email = email.toLowerCase();
    const user = await this.userService.findByEmail(loginRequestDto.email);
    if (!user) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    if (!user.status) {
      throw new UnauthorizedException('Your account is not active');
    }
    const isMatch = comparePassword(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    user.lastLogin = new Date();

    await this.userService.store(user);

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      user: UserDto.plainToInstance(user, ['private']),
      accessToken,
    };
  }
}
