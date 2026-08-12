import { Module, OnModuleInit } from '@nestjs/common';
import { WinstonModule } from '@src/utils/logging/winston.module';
import { MessagesGateway } from './messages.sockets';
import { JsonWebTokenModule } from '@src/common/jsonwebtoken/jwt.module';
import { CloudinaryModule } from '@src/common/cloudinary/Cloudinary.module';
import { AuthModule } from '@src/features/auth/auth.module';
import { MessageSocketService } from './services/send-message.service';
import { MessagesModule } from '@src/features/messages/messages.module';
import { ChatModule } from '@src/features/chats/chats.module';

@Module({
  imports: [
    WinstonModule,
    JsonWebTokenModule,
    CloudinaryModule,
    AuthModule,
    MessagesModule,
    ChatModule,
  ],
  providers: [MessagesGateway, MessageSocketService],
  exports: [],
})
export class SocketModule {}
