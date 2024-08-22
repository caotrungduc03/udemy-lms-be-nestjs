export class CustomResponse {
  statusCode: number;
  message: string;
  data?: any;
  path?: string;

  constructor(statusCode: number, message: string, data?: any, path?: string) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.path = path;
  }
}
