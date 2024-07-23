import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
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
  async login(@Res() res: Response, @Body() loginRequestDto: LoginRequestDto) {
    const loginResponseDto: LoginResponseDto = await this.authService.login(loginRequestDto);

    return res
      .status(HttpStatus.OK)
      .json(new CustomResponse(HttpStatus.OK, 'User logged in', loginResponseDto));
  }
}
