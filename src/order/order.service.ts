import { BadRequestException, Injectable } from '@nestjs/common';
import { CourseService } from 'src/course/course.service';
import { CreateOrderDto } from 'src/dtos';
import { ProgressService } from 'src/progress/progress.service';
import { RabbitmqService } from 'src/rabbitmq/rabbitmq.service';
import { In } from 'typeorm';

interface OrderResponse {
  status: boolean;
  message: string;
}

@Injectable()
export class OrderService {
  constructor(
    private readonly rabbitmqService: RabbitmqService,
    private readonly courseService: CourseService,
    private readonly progressService: ProgressService,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: any): Promise<any> {
    const { courseIds } = createOrderDto;
    const { userId, email } = user;
    const [courses, existingProgress] = await Promise.all([
      Promise.all(
        courseIds.map((courseId) => this.courseService.findById(courseId)),
      ),
      this.progressService.findOne({
        where: {
          userId,
          courseId: In(courseIds),
        },
      }),
    ]);
    if (existingProgress) {
      throw new BadRequestException('Progress already exists');
    }

    const orderData = {
      ...createOrderDto,
      client_id: userId,
      client_email: email,
      items: courses.map((course) => ({
        course_id: course.id,
        author_id: course.authorId,
        amount: course.price,
      })),
    };

    const response: OrderResponse = await this.rabbitmqService.sendMessage(
      'order',
      orderData,
    );
    if (!response.status) {
      throw new BadRequestException(response.message);
    }

    await this.progressService.store(
      courseIds.map((courseId) => ({
        userId,
        courseId,
      })),
    );

    return response;
  }
}
