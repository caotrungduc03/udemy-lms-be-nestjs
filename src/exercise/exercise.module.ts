import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseModule } from 'src/course/course.module';
import { ExerciseEntity } from 'src/entities';
import { UserModule } from 'src/user/user.module';
import { ExerciseController } from './exercise.controller';
import { ExerciseService } from './exercise.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExerciseEntity]),
    CourseModule,
    UserModule,
  ],
  controllers: [ExerciseController],
  providers: [ExerciseService],
  exports: [ExerciseService],
})
export class ExerciseModule {}
