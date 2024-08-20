import { Module } from '@nestjs/common';
import { CourseModule } from 'src/course/course.module';
import { RabbitmqModule } from 'src/rabbitmq/rabbitmq.module';
import { UserModule } from 'src/user/user.module';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';

@Module({
  imports: [RabbitmqModule, UserModule, CourseModule],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
