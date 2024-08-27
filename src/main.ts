import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './utils/allExceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpAdapterHost: HttpAdapterHost = app.get(HttpAdapterHost);

  app.enableCors();
  app.setGlobalPrefix('api/v1', {
    exclude: ['/'],
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  await app.listen(4000);
}
bootstrap();
