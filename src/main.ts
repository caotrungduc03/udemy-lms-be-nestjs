import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './utils/allExceptionsFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpAdapterHost: HttpAdapterHost = app.get(HttpAdapterHost);

  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  await app.listen(4000);
}
bootstrap();
