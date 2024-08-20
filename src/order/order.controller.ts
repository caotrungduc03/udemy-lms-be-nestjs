import { Body, Controller, HttpStatus, Post, Req } from '@nestjs/common';
import { CreateOrderDto } from 'src/dtos';
import { CustomResponse } from 'src/utils/customResponse';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/')
  async create(
    @Req() request: Request,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    const userReq = request['user'];
    const order = await this.orderService.create(
      createOrderDto,
      userReq.userId,
    );
    return new CustomResponse(HttpStatus.OK, 'Order created');
  }
}
