import { Controller, Get, HttpStatus, Query, Req } from '@nestjs/common';
import { CustomResponse } from 'src/utils/customResponse';
import { RoleEnum } from 'src/utils/role.enum';
import { Roles } from 'src/utils/roles.decorator';
import { ReportService } from './report.service';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('/')
  @Roles(RoleEnum.PROFESSOR, RoleEnum.ADMIN)
  async getReport(@Req() request: Request, @Query() query: Object) {
    const userReq = request['user'];
    const report = await this.reportService.getReport({
      ...query,
      userId: userReq.userId,
    });
    return new CustomResponse(HttpStatus.OK, 'Success', report);
  }
}
