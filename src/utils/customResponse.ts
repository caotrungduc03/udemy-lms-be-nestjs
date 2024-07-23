export class CustomResponse<T = any> {
  statusCode: number;
  message: string;
  data?: T;
  path?: string;

  constructor(statusCode: number, message: string, data?: T, path?: string) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.path = path;
  }
}
