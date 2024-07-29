import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  Optional,
  PipeTransform,
} from '@nestjs/common';

interface CustomParseFilePipeOptions {
  maxSize?: number;
  mimetypes?: string[];
  required?: boolean;
}

const DEFAULT_FILE_OPTIONS = {
  maxSize: 5 * 1024 * 1024,
  mimetypes: ['image/jpg', 'image/jpeg', 'image/png'],
  required: false,
};

@Injectable()
export class CustomParseFilePipe implements PipeTransform {
  private readonly maxSize: number;
  private readonly mimetypes: string[];
  private readonly required: boolean;

  constructor(@Optional() options?: CustomParseFilePipeOptions) {
    this.maxSize = options?.maxSize || DEFAULT_FILE_OPTIONS.maxSize;
    this.mimetypes = options?.mimetypes || DEFAULT_FILE_OPTIONS.mimetypes;
    this.required = options?.required ?? DEFAULT_FILE_OPTIONS.required;
  }

  async transform(
    value: Express.Multer.File,
    metadata: ArgumentMetadata,
  ): Promise<Express.Multer.File | null> {
    if (!value && this.required) {
      throw new BadRequestException('File is required');
    }

    if (!value) {
      return null;
    }

    if (value.size > this.maxSize) {
      throw new BadRequestException(
        `File size must be less than ${this.maxSize} bytes`,
      );
    }

    if (!this.mimetypes.includes(value.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${this.mimetypes.join(', ')}`,
      );
    }

    return value;
  }
}
