import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserRepository } from '@src/features/auth/respository/users.repository';
import { Results } from '@src/utils/responses/SuccessfulResponse';
import { CreateChatRequest } from '../dto/request/create-chat.request';
import { UpdateChatRequest } from '../dto/request/update-chat.request';
import { ChatResponse } from '../dto/responses/chat.response';
import { Chats, ChatType } from '../entities/chat.entities';
import { ChatMembersRepository } from '../repository/chat-members.repository';
import { ChatsRepository } from '../repository/chats.repository';
import { IChatsService } from './interface';

@Injectable()
export class ChatsService implements IChatsService {
  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly chatMembersRepository: ChatMembersRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createChat(userId: number, request: CreateChatRequest) {
    if (request.type === ChatType.SINGLE) {
      return this.createSingleChat(userId, request);
    }
    return this.createGroupChat(userId, request);
  }

  async getUserChats(userId: number) {
    const chats = await this.chatsRepository.findChatsForUser(userId);
    const data = chats.map((chat) => this.toResponse(chat));
    return Results('Chats fetched successfully', data);
  }

  async getChatById(userId: number, chatId: number) {
    const isMember = await this.chatMembersRepository.isMember(chatId, userId);
    if (!isMember) throw new NotFoundException('Chat not found');

    return Results(
      'Chat fetched successfully',
      await this.buildResponse(chatId),
    );
  }

  async updateChat(userId: number, chatId: number, request: UpdateChatRequest) {
    const chat = await this.chatsRepository.findChatById(chatId);
    if (!chat) throw new NotFoundException('Chat not found');
    if (chat.type !== ChatType.GROUP)
      throw new BadRequestException('Only group chats can be renamed');

    await this.ensureAdmin(chatId, userId);

    await this.chatsRepository.updateChatName(chatId, request.name);

    return Results(
      'Chat updated successfully',
      await this.buildResponse(chatId),
    );
  }

  async leaveChat(userId: number, chatId: number) {
    const membership = await this.chatMembersRepository.findMember(
      chatId,
      userId,
    );
    if (!membership) throw new NotFoundException('Chat not found');

    await this.chatMembersRepository.removeMember(chatId, userId);

    const remaining = await this.chatMembersRepository.countMembers(chatId);
    if (remaining === 0) await this.chatsRepository.deleteChat(chatId);

    return Results('Left the chat successfully', null);
  }

  private async createSingleChat(userId: number, request: CreateChatRequest) {
    if (!request.participantIdentifier)
      throw new BadRequestException(
        'participantIdentifier is required for single chats',
      );

    const participant = await this.userRepository.findUserByIdentifier(
      request.participantIdentifier,
    );
    if (!participant) throw new NotFoundException('User not found');
    if (participant.id === userId)
      throw new BadRequestException('You cannot start a chat with yourself');

    const existing = await this.chatsRepository.findSingleChatBetweenUsers(
      userId,
      participant.id,
    );
    if (existing)
      throw new BadRequestException(
        'A single chat already exists with this user',
      );

    const chat = await this.chatsRepository.createChat({
      type: ChatType.SINGLE,
    });
    await this.chatMembersRepository.addMembers(chat.id, [
      userId,
      participant.id,
    ]);

    return Results(
      'Chat created successfully',
      await this.buildResponse(chat.id),
    );
  }

  private async createGroupChat(userId: number, request: CreateChatRequest) {
    if (!request.name)
      throw new BadRequestException('A name is required for group chats');

    const identifiers = Array.from(new Set(request.memberIdentifiers ?? []));
    const members =
      await this.userRepository.findUsersByIdentifiers(identifiers);
    if (members.length !== identifiers.length)
      throw new NotFoundException('One or more users were not found');
    if (members.some((member) => member.id === userId))
      throw new BadRequestException(
        'You cannot add yourself to the chat twice',
      );

    const chat = await this.chatsRepository.createChat({
      type: ChatType.GROUP,
      name: request.name,
    });
    await this.chatMembersRepository.addMember(chat.id, userId, {
      isAdmin: true,
    });
    await this.chatMembersRepository.addMembers(
      chat.id,
      members.map((member) => member.id),
    );

    return Results(
      'Group chat created successfully',
      await this.buildResponse(chat.id),
    );
  }

  private async ensureAdmin(chatId: number, userId: number): Promise<void> {
    const membership = await this.chatMembersRepository.findMember(
      chatId,
      userId,
    );
    if (!membership) throw new NotFoundException('Chat not found');
    if (!membership.isAdmin)
      throw new ForbiddenException('Only group admins can perform this action');
  }

  private async buildResponse(chatId: number): Promise<ChatResponse> {
    const chat = await this.chatsRepository.findChatById(chatId);
    if (!chat) throw new NotFoundException('Chat not found');
    return this.toResponse(chat);
  }

  private toResponse(chat: Chats): ChatResponse {
    return plainToInstance(ChatResponse, chat, {
      excludeExtraneousValues: true,
    });
  }
}
