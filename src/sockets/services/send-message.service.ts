import { Injectable } from '@nestjs/common';
import { UserRepository } from '@src/features/auth/respository/users.repository';
import { ChatsRepository } from '@src/features/chats/repository/chats.repository';
import { MessagesRepository } from '@src/features/messages/repository/messages.repository';
import { SendMessageRequest } from '../request/send-message.request';
import { SendMessageResponse } from '../response/send-message.response';
import { CloudinaryService } from '@src/common/cloudinary/cloudinary.service';
import { MessageType } from '@src/features/messages/entities/messages.entities';
import { plainToInstance } from 'class-transformer';
import { UsersResponse } from '@src/common/entity/user-entity.dto';

@Injectable()
export class MessageSocketService {
  constructor(
    private readonly messagesRepository: MessagesRepository,
    private readonly chatsRepository: ChatsRepository,
    private readonly usersRepository: UserRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    const user = await this.usersRepository.findUserById(
      request.senderId as number,
    );

    // saving those buffer in the
    if (!user) throw new Error('The user do not exists');

    // checking if the chat Exists
    const chatExists = await this.chatsRepository.findChatById(request.chatId);

    if (!chatExists) throw new Error('The chat do not exist');
    let uploadFileResult: string | undefined = undefined;
    if (request.messageType != MessageType.TEXT && request.attachment != null) {
      const res = await this.cloudinaryService.saveBuffer(request.attachment);
      uploadFileResult = res.secure_url;
    }

    //saving the message in the repository
    await this.messagesRepository.createMessage({
      chatId: request.chatId,
      attachmentUrl: uploadFileResult,
      replyToMessageId: undefined,
      message: request.message,
      type: request.messageType,
      senderId: request.senderId as number,
    });

    const response = new SendMessageResponse();
    response.attachment = uploadFileResult;
    ((response.chatId = request.chatId), (response.message = request.message));
    response.sender = plainToInstance(UsersResponse, user, {
      excludeExtraneousValues: true,
    });
    response.messageType = request.messageType;

    return response;
  }
}
