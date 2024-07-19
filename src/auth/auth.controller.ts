import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { LoginRequestDto, LoginResponseDto, RegisterDto, UserDto } from 'src/dtos';
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
  async login(@Body() loginRequestDto: LoginRequestDto) {
    const loginResponseDto: LoginResponseDto = await this.authService.login(loginRequestDto);

    return new CustomResponse(HttpStatus.OK, 'User logged in', loginResponseDto);
  }
}
