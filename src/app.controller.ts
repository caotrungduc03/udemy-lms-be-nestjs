import { Controller, Get } from '@nestjs/common';
import { Public } from './utils/public.decorator';

@Controller('/')
export class AppController {
  constructor() {}

  @Get('/')
  @Public()
  getHello(): string {
    return '<h1 style="text-align:center">Welcome to UDEMY LMS! ❤️</h1>';
  }
}
