import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { CourseModule } from './course/course.module';
import { DatabaseSeederModule } from './database-seeder/database-seeder.module';
import { DatabaseSeederService } from './database-seeder/database-seeder.service';
import { UserEntity } from './entities';
import { RoleModule } from './role/role.module';
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
    RoleModule,
    UserModule,
    AuthModule,
    CourseModule,
    CategoryModule,
    DatabaseSeederModule,
  ],
  controllers: [],
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
