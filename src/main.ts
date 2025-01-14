import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import * as morgan from 'morgan';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './utils/allExceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpAdapterHost: HttpAdapterHost = app.get(HttpAdapterHost);
  app.use(morgan('tiny'));
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  app.setGlobalPrefix('api/v1', {
    exclude: ['/'],
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  await app.listen(4000);
}
bootstrap();
