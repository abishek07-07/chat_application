import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@src/features/auth/auth.module';
import { ChatMemberController } from './controllers/chat-member.controller';
import { ChatsController } from './controllers/chats.controller';
import { Chats } from './entities/chat.entities';
import { ChatMembers } from './entities/chats-members.entites';
import { ChatMembersRepository } from './repository/chat-members.repository';
import { ChatsRepository } from './repository/chats.repository';
import { ChatMembersService } from './services/chats-members.services';
import { ChatsService } from './services/chats.services';

@Module({
  imports: [TypeOrmModule.forFeature([Chats, ChatMembers]), AuthModule],
  providers: [
    ChatsRepository,
    ChatMembersRepository,
    ChatsService,
    ChatMembersService,
  ],
  exports: [
    ChatsService,
    ChatMembersService,
    ChatMembersRepository,
    ChatsRepository,
  ],
  controllers: [ChatsController, ChatMemberController],
})
export class ChatModule {}
