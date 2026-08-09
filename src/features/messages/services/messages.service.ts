import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ChatMembersRepository } from '@src/features/chats/repository/chat-members.repository';
import { Results } from '@src/utils/responses/SuccessfulResponse';
import { CreateMessageRequest } from '../dto/request/create-message.request';
import { UpdateMessageRequest } from '../dto/request/update-message.request';
import {
  MessageResponse,
  PaginatedMessageResponse,
} from '../dto/responses/message.response';
import { Messages, MessageType } from '../entities/messages.entities';
import { MessageReadsRepository } from '../repository/message-reads.repository';
import { MessagesRepository } from '../repository/messages.repository';
import { IdCryptoService } from '../utils/id-crypto.service';
import { IMessagesService } from './interface';

@Injectable()
export class MessagesService implements IMessagesService {
  constructor(
    private readonly messagesRepository: MessagesRepository,
    private readonly messageReadsRepository: MessageReadsRepository,
    private readonly chatMembersRepository: ChatMembersRepository,
    private readonly idCryptoService: IdCryptoService,
  ) {}

  async sendMessage(userId: number, request: CreateMessageRequest) {
    await this.ensureMembership(request.chatId, userId);
    this.validateMessagePayload(request);

    let replyToMessageId: number | undefined;
    if (request.replyToMessageKey) {
      replyToMessageId = this.idCryptoService.resolveMessageId(
        request.replyToMessageKey,
      );
      const replyTo =
        await this.messagesRepository.findMessageById(replyToMessageId);
      if (!replyTo || replyTo.isDeleted)
        throw new BadRequestException(
          'The message being replied to is invalid',
        );
    }

    const message = await this.messagesRepository.createMessage({
      chatId: request.chatId,
      senderId: userId,
      type: request.type,
      message: request.message,
      attachmentUrl: request.attachmentUrl,
      replyToMessageId,
    });

    return Results('Message sent successfully', this.toResponse(message));
  }

  async getMessages(
    userId: number,
    chatId: number,
    limit = 50,
    cursor?: string,
  ) {
    await this.ensureMembership(chatId, userId);

    const decodedCursor = cursor
      ? this.idCryptoService.resolveCursor(cursor)
      : undefined;

    const messages = await this.messagesRepository.findMessagesByCursor(
      chatId,
      limit + 1,
      decodedCursor,
    );

    const hasMore = messages.length > limit;
    const page = messages.slice(0, limit);
    const last = page[page.length - 1];

    const data: PaginatedMessageResponse = {
      items: page.map((message) => this.toResponse(message)),
      nextCursor:
        hasMore && last
          ? this.idCryptoService.createCursor(last.id, last.sentAt)
          : null,
      hasMore,
    };

    return Results('Messages fetched successfully', data);
  }

  async getMessageById(userId: number, messageKey: string) {
    const message = await this.findMessageOrThrow(
      this.idCryptoService.resolveMessageId(messageKey),
    );
    await this.ensureMembership(message.chatId, userId);

    return Results('Message fetched successfully', this.toResponse(message));
  }

  async editMessage(
    userId: number,
    messageKey: string,
    request: UpdateMessageRequest,
  ) {
    const message = await this.ensureOwnMessage(
      this.idCryptoService.resolveMessageId(messageKey),
      userId,
    );
    if (message.type !== MessageType.TEXT)
      throw new BadRequestException('Only text messages can be edited');

    await this.messagesRepository.updateMessage(message.id, {
      message: request.message,
      isEdited: true,
      editedAt: new Date(),
    });

    return Results('Message updated successfully', this.toResponse(message));
  }

  async deleteMessage(userId: number, messageKey: string) {
    const message = await this.ensureOwnMessage(
      this.idCryptoService.resolveMessageId(messageKey),
      userId,
    );

    await this.messagesRepository.softDeleteMessage(message.id, new Date());

    return Results('Message deleted successfully', null);
  }

  async markAsRead(userId: number, messageKey: string) {
    const message = await this.findMessageOrThrow(
      this.idCryptoService.resolveMessageId(messageKey),
    );
    await this.ensureMembership(message.chatId, userId);
    if (message.senderId === userId)
      throw new BadRequestException('You cannot mark your own message as read');

    await this.messageReadsRepository.markAsRead(message.id, userId);

    return Results('Message marked as read', null);
  }

  private validateMessagePayload(request: CreateMessageRequest): void {
    if (request.type === MessageType.TEXT && !request.message)
      throw new BadRequestException('A message is required for text messages');
    if (request.type !== MessageType.TEXT && !request.attachmentUrl)
      throw new BadRequestException(
        'An attachmentUrl is required for image and file messages',
      );
  }

  private async ensureMembership(
    chatId: number,
    userId: number,
  ): Promise<void> {
    const isMember = await this.chatMembersRepository.isMember(chatId, userId);
    if (!isMember) throw new NotFoundException('Chat not found');
  }

  private async findMessageOrThrow(messageId: number): Promise<Messages> {
    const message = await this.messagesRepository.findMessageById(messageId);
    if (!message) throw new NotFoundException('Message not found');
    return message;
  }

  private async ensureOwnMessage(
    messageId: number,
    userId: number,
  ): Promise<Messages> {
    const message = await this.findMessageOrThrow(messageId);
    if (message.isDeleted) throw new NotFoundException('Message not found');
    if (message.senderId !== userId)
      throw new ForbiddenException(
        'You can only manage messages that you sent',
      );

    return message;
  }

  private toResponse(message: Messages): MessageResponse {
    const replyToId = message.replyToMessage?.id ?? message.replyToMessageId;

    return {
      key: this.idCryptoService.signMessageId(message.id),
      chatId: message.chatId,
      senderId: message.senderId,
      type: message.type,
      message: message.message,
      attachmentUrl: message.attachmentUrl,
      sentAt: message.sentAt,
      isDeleted: message.isDeleted,
      isEdited: message.isEdited,
      editedAt: message.editedAt,
      replyToMessageKey: replyToId
        ? this.idCryptoService.signMessageId(replyToId)
        : undefined,
      sender: message.sender
        ? {
            id: message.sender.id,
            email: message.sender.email,
            firstName: message.sender.firstName,
            lastName: message.sender.lastName,
          }
        : undefined,
      replyToMessage: message.replyToMessage
        ? this.toResponse(message.replyToMessage)
        : undefined,
      reads: (message.reads ?? []).map((read) => ({
        userId: read.userId,
        seenAt: read.seenAt,
      })),
    };
  }
}
