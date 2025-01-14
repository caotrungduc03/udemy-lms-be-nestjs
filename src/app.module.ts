import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CourseModule } from './course/course.module';
import { DatabaseSeederModule } from './database-seeder/database-seeder.module';
import { DatabaseSeederService } from './database-seeder/database-seeder.service';
import { UserEntity } from './entities';
import { ExerciseModule } from './exercise/exercise.module';
import { LessonModule } from './lesson/lesson.module';
import { OrderModule } from './order/order.module';
import { ProgressExerciseQuestionModule } from './progress-exercise-question/progress-exercise-question.module';
import { ProgressExerciseModule } from './progress-exercise/progress-exercise.module';
import { ProgressLessonsModule } from './progress-lessons/progress-lessons.module';
import { ProgressModule } from './progress/progress.module';
import { QuestionModule } from './question/question.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { ReportModule } from './report/report.module';
import { RoleModule } from './role/role.module';
import { SubmissionModule } from './submission/submission.module';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { AllExceptionsFilter } from './utils/allExceptions.filter';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 1000,
        limit: 10,
      },
    ]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER_NAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
        ca: process.env.CA_PEM,
      },
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
    TypeOrmModule.forFeature([UserEntity]),
    DatabaseSeederModule,
    RoleModule,
    UserModule,
    AuthModule,
    CourseModule,
    CategoryModule,
    CloudinaryModule,
    ProgressModule,
    LessonModule,
    ProgressLessonsModule,
    ExerciseModule,
    QuestionModule,
    ProgressExerciseModule,
    ProgressExerciseQuestionModule,
    RabbitmqModule,
    OrderModule,
    ReportModule,
    SubmissionModule,
  ],
  controllers: [AppController],
  providers: [
    UserService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly databaseSeederService: DatabaseSeederService) {}

  async onModuleInit() {
    await this.databaseSeederService.seed();
  }
}
