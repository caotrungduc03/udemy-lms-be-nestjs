import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { LoginRequestDto, LoginResponseDto, RegisterDto, UserDto } from 'src/dtos';
import { CustomResponse } from 'src/utils/customResponse';
import { Public } from 'src/utils/public.decorator';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    const userDto: UserDto = await this.authService.register(registerDto);

    return new CustomResponse(HttpStatus.CREATED, 'User created', userDto);
  }

  @Public()
  @Post('/login')
  async login(@Body() loginRequestDto: LoginRequestDto) {
    const loginResponseDto: LoginResponseDto = await this.authService.login(loginRequestDto);

    return new CustomResponse(HttpStatus.OK, 'User logged in', loginResponseDto);
  }
}
