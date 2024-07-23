import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseEntity } from 'src/entities';
import { UserModule } from 'src/user/user.module';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';

@Module({
  imports: [TypeOrmModule.forFeature([CourseEntity]), UserModule],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
