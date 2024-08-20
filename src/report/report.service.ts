import { BadRequestException, Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import { CourseService } from 'src/course/course.service';
import { RabbitmqService } from 'src/rabbitmq/rabbitmq.service';
import { UserService } from 'src/user/user.service';

interface Query {
  userId: number;
  start_time?: string;
  end_time?: string;
}

@Injectable()
export class ReportService {
  constructor(
    private readonly rabbitmqService: RabbitmqService,
    private readonly userService: UserService,
    private readonly courseService: CourseService,
  ) {}

  async getReport(query: Query): Promise<any> {
    const { userId } = query;
    let start_date = format(query['start_date'] || new Date(), 'yyyy-MM-dd');
    let end_date = format(query['end_date'] || new Date(), 'yyyy-MM-dd');

    const whereObj: any = {};
    const hasAdminRole = await this.userService.checkAdminRole(userId);

    if (!hasAdminRole) {
      whereObj.authorId = userId;
    }
    const courseIds = await this.courseService.findCourseIds(whereObj);

    const reportData = {
      ...whereObj,
      start_date,
      end_date,
      course_id: courseIds,
    };
    const response = await this.rabbitmqService.sendMessage(
      'report',
      reportData,
    );
    if (!response.status) {
      throw new BadRequestException(response.message);
    }

    return response.data;
  }
}
