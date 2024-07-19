import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { LoginRequestDto, LoginResponseDto, RegisterDto, UserDto } from 'src/dtos';
import { CustomResponse } from 'src/utils/customResponse';
import { Public } from 'src/utils/public.decorator';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @Public()
  async register(@Body() registerDto: RegisterDto) {
    const userDto: UserDto = await this.authService.register(registerDto);

    return new CustomResponse(HttpStatus.CREATED, 'User created', userDto);
  }

  @Post('/login')
  @Public()
  async login(@Body() loginRequestDto: LoginRequestDto) {
    const loginResponseDto: LoginResponseDto = await this.authService.login(loginRequestDto);

    return new CustomResponse(HttpStatus.OK, 'User logged in', loginResponseDto);
  }
}
