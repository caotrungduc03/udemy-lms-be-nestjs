import { Module } from '@nestjs/common';
import { CourseModule } from 'src/course/course.module';
import { ProgressModule } from 'src/progress/progress.module';
import { RabbitmqModule } from 'src/rabbitmq/rabbitmq.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [RabbitmqModule, CourseModule, ProgressModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
