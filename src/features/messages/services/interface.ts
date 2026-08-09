import { IResult } from '@src/utils/responses/SuccessfulResponse';
import { CreateMessageRequest } from '../dto/request/create-message.request';
import { UpdateMessageRequest } from '../dto/request/update-message.request';
import {
  MessageResponse,
  PaginatedMessageResponse,
} from '../dto/responses/message.response';

export interface IMessagesService {
  sendMessage(
    userId: number,
    request: CreateMessageRequest,
  ): Promise<IResult<MessageResponse>>;
  getMessages(
    userId: number,
    chatId: number,
    limit?: number,
    cursor?: string,
  ): Promise<IResult<PaginatedMessageResponse>>;
  getMessageById(
    userId: number,
    messageKey: string,
  ): Promise<IResult<MessageResponse>>;
  editMessage(
    userId: number,
    messageKey: string,
    request: UpdateMessageRequest,
  ): Promise<IResult<MessageResponse>>;
  deleteMessage(userId: number, messageKey: string): Promise<IResult<null>>;
  markAsRead(userId: number, messageKey: string): Promise<IResult<null>>;
}
