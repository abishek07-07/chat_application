import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@src/features/auth/auth.module';
import { ChatModule } from '@src/features/chats/chats.module';
import { MessagesController } from './controllers/messages.controller';
import { Messages } from './entities/messages.entities';
import { MessageReads } from './entities/messages-reads.entities';
import { MessageReadsRepository } from './repository/message-reads.repository';
import { MessagesRepository } from './repository/messages.repository';
import { MessagesService } from './services/messages.service';
import { IdCryptoService } from './utils/id-crypto.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Messages, MessageReads]),
    AuthModule,
    ChatModule,
  ],
  providers: [
    MessagesRepository,
    MessageReadsRepository,
    MessagesService,
    IdCryptoService,
  ],
  exports: [MessagesService],
  controllers: [MessagesController],
})
export class MessagesModule {}
