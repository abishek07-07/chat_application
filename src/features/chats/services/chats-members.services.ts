import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserRepository } from '@src/features/auth/respository/users.repository';
import { Results } from '@src/utils/responses/SuccessfulResponse';
import { AddChatMembersRequest } from '../dto/request/add-chat-members.request';
import { RemoveChatMembersRequest } from '../dto/request/remove-chat-members.request';
import { ChatMemberResponse } from '../dto/responses/chat-member.response';
import { ChatType } from '../entities/chat.entities';
import { ChatMembersRepository } from '../repository/chat-members.repository';
import { ChatsRepository } from '../repository/chats.repository';
import { IChatMembersService } from './interface';

@Injectable()
export class ChatMembersService implements IChatMembersService {
  constructor(
    private readonly chatMembersRepository: ChatMembersRepository,
    private readonly chatsRepository: ChatsRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async getChatMembers(userId: number, chatId: number) {
    await this.ensureMembership(chatId, userId);

    const members = await this.chatMembersRepository.findMembersForChat(chatId);
    const data = plainToInstance(ChatMemberResponse, members, {
      excludeExtraneousValues: true,
    });

    return Results('Chat members fetched successfully', data);
  }

  async addMembers(
    userId: number,
    chatId: number,
    request: AddChatMembersRequest,
  ) {
    await this.ensureGroupAdmin(chatId, userId);

    const identifiers = Array.from(new Set(request.memberIdentifiers));
    const users = await this.userRepository.findUsersByIdentifiers(identifiers);
    if (users.length !== identifiers.length)
      throw new NotFoundException('One or more users were not found');

    const userIds = users.map((user) => user.id);
    const existing = await this.chatMembersRepository.findExistingMembers(
      chatId,
      userIds,
    );
    const existingIds = new Set(existing.map((member) => member.userId));
    const newUserIds = userIds.filter((id) => !existingIds.has(id));
    if (newUserIds.length === 0)
      throw new BadRequestException(
        'All users are already members of this chat',
      );

    await this.chatMembersRepository.addMembers(chatId, newUserIds);

    return Results('Members added successfully', null);
  }

  async removeMembers(
    userId: number,
    chatId: number,
    request: RemoveChatMembersRequest,
  ) {
    await this.ensureGroupAdmin(chatId, userId);

    const identifiers = Array.from(new Set(request.memberIdentifiers));
    const users = await this.userRepository.findUsersByIdentifiers(identifiers);
    if (users.length !== identifiers.length)
      throw new NotFoundException('One or more users were not found');

    const userIds = users.map((user) => user.id);
    if (userIds.includes(userId))
      throw new BadRequestException(
        'Admins cannot remove themselves; leave the chat instead',
      );

    await this.chatMembersRepository.removeMembers(chatId, userIds);

    return Results('Members removed successfully', null);
  }

  private async ensureMembership(
    chatId: number,
    userId: number,
  ): Promise<void> {
    const isMember = await this.chatMembersRepository.isMember(chatId, userId);
    if (!isMember) throw new NotFoundException('Chat not found');
  }

  private async ensureGroupAdmin(
    chatId: number,
    userId: number,
  ): Promise<void> {
    const chat = await this.chatsRepository.findChatById(chatId);
    if (!chat) throw new NotFoundException('Chat not found');
    if (chat.type !== ChatType.GROUP)
      throw new BadRequestException(
        'Member management is only available for group chats',
      );

    const membership = await this.chatMembersRepository.findMember(
      chatId,
      userId,
    );
    if (!membership) throw new NotFoundException('Chat not found');
    if (!membership.isAdmin)
      throw new ForbiddenException('Only group admins can manage members');
  }
}
