import { BadRequestException, Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import { CourseService } from 'src/course/course.service';
import { RabbitmqService } from 'src/rabbitmq/rabbitmq.service';
import { UserService } from 'src/user/user.service';

type Query = {
  userId: number;
  startDate?: string;
  endDate?: string;
};

type ReportData = {
  author_id?: number;
  course_id?: number[];
  start_date?: string;
  end_date?: string;
};

@Injectable()
export class ReportService {
  constructor(
    private readonly rabbitmqService: RabbitmqService,
    private readonly userService: UserService,
    private readonly courseService: CourseService,
  ) {}

  async getReport(query: Query): Promise<any> {
    const { userId } = query;
    let start_date = format(query.startDate || new Date(), 'yyyy-MM-dd');
    let end_date = format(query.endDate || new Date(), 'yyyy-MM-dd');

    const hasAdminRole = await this.userService.checkAdminRole(userId);

    let reportData: ReportData = {};
    if (hasAdminRole) {
      const courseIds = await this.courseService.findCourseIds({});
      Object.assign(reportData, {
        start_date,
        end_date,
        course_id: courseIds,
      });
    } else {
      const courseIds = await this.courseService.findCourseIds({
        authorId: userId,
      });
      Object.assign(reportData, {
        author_id: userId,
        start_date,
        end_date,
        course_id: courseIds,
      });
    }

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
