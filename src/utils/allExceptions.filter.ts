import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { CustomResponse } from './customResponse';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = 'Internal Server Error';
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      if (typeof exception.getResponse() === 'object') {
        if (Array.isArray(exception.getResponse()['message'])) {
          message = exception.getResponse()['message'].join(', ');
        } else {
          message = exception.getResponse()['message'];
        }
      } else {
        message = exception.getResponse().toString();
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const responseBody = new CustomResponse(
      statusCode,
      message,
      null,
      httpAdapter.getRequestUrl(request),
    );

    httpAdapter.reply(response, responseBody, statusCode);
  }
}
