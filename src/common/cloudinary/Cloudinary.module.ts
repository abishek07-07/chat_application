import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { v2 } from 'cloudinary';
import { CloudinaryService } from './cloudinary.service';
import { CLOUDINARY } from './constants';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      inject: [ConfigService],
      provide: CLOUDINARY,

      useFactory(config: ConfigService) {
        return v2.config({
          cloud_name: config.getOrThrow<string>('cloudinary.cloudName'),
          api_key: config.get<string>('cloudinary.apiKey'),
          api_secret: config.get<string>('cloudinary.apiSecret'),
        });
      },
    },
    CloudinaryService,
  ],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
