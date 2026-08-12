import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from '@config/jwt.config';
import swaggerConfig from '@config/swagger.config';
import { WinstonModule as WnModule } from './utils/logging/winston.module';
import { DatabaseModule } from './common/database/database.module';
import databaseConfig from '@config/database.config';
import dotenv from 'dotenv';
import { JsonWebTokenModule } from './common/jsonwebtoken/jwt.module';
import { AuthModule } from './features/auth/auth.module';
import { FriendsModule } from './features/friends/friends.module';
import { ChatModule } from './features/chats/chats.module';
import { MessagesModule } from './features/messages/messages.module';
import { SocketModule } from './sockets/sockets.module';
import cloudinaryConfig from '@config/cloudinary.config';
import { CloudinaryModule } from './common/cloudinary/Cloudinary.module';
dotenv.config();
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      load: [jwtConfig, swaggerConfig, databaseConfig, cloudinaryConfig],
    }),
    DatabaseModule,
    WnModule,
    JsonWebTokenModule,
    AuthModule,
    FriendsModule,
    ChatModule,
    MessagesModule,
    CloudinaryModule,
    SocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
