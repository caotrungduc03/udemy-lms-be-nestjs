import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { LoginDto, RegisterDto, UserDto } from 'src/dtos';
import { CustomResponse } from 'src/utils/customResponse';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    const userDto: UserDto = await this.authService.register(registerDto);

    return new CustomResponse(HttpStatus.CREATED, 'User created', userDto);
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.login(loginDto);

    return new CustomResponse(HttpStatus.OK, 'User logged in', {
      user: UserDto.plainToInstance(user),
    });
  }
}
