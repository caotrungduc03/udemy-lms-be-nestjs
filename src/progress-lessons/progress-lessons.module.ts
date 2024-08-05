import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgressLessonsEntity } from 'src/entities';
import { LessonModule } from 'src/lesson/lesson.module';
import { ProgressModule } from 'src/progress/progress.module';
import { ProgressLessonsController } from './progress-lessons.controller';
import { ProgressLessonsService } from './progress-lessons.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProgressLessonsEntity]),
    LessonModule,
    ProgressModule,
  ],
  controllers: [ProgressLessonsController],
  providers: [ProgressLessonsService],
  exports: [ProgressLessonsService],
})
export class ProgressLessonsModule {}
