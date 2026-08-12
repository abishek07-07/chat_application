import { Inject, Injectable } from '@nestjs/common';
import { v2 as Cloudinary, UploadApiResponse } from 'cloudinary';
import { CLOUDINARY } from './constants';

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject(CLOUDINARY)
    private readonly cloudinary: typeof Cloudinary,
  ) {}

  async saveBuffer(buffer: Buffer): Promise<UploadApiResponse> {
    return await new Promise((resolve, reject) => {
      const stream = this.cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result as UploadApiResponse);
          }
        },
      );

      stream.end(buffer);
    });
  }

  async saveFile(request: string): Promise<UploadApiResponse> {
    return await this.cloudinary.uploader.upload(request);
  }
}
