import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { CloudinaryResponse } from './cloudinary-response';

@Injectable()
export class CloudinaryService {
  uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const readableStream = new Readable();
      readableStream.push(file.buffer);
      readableStream.push(null);

      const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      });

      readableStream.pipe(uploadStream);
    });
  }
}
