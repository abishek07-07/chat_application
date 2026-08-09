import { IResult } from '@src/utils/responses/SuccessfulResponse';
import { AddChatMembersRequest } from '../dto/request/add-chat-members.request';
import { CreateChatRequest } from '../dto/request/create-chat.request';
import { RemoveChatMembersRequest } from '../dto/request/remove-chat-members.request';
import { UpdateChatRequest } from '../dto/request/update-chat.request';
import { ChatMemberResponse } from '../dto/responses/chat-member.response';
import { ChatResponse } from '../dto/responses/chat.response';

export interface IChatsService {
  createChat(
    userId: number,
    request: CreateChatRequest,
  ): Promise<IResult<ChatResponse>>;
  getUserChats(userId: number): Promise<IResult<ChatResponse[]>>;
  getChatById(userId: number, chatId: number): Promise<IResult<ChatResponse>>;
  updateChat(
    userId: number,
    chatId: number,
    request: UpdateChatRequest,
  ): Promise<IResult<ChatResponse>>;
  leaveChat(userId: number, chatId: number): Promise<IResult<null>>;
}

export interface IChatMembersService {
  getChatMembers(
    userId: number,
    chatId: number,
  ): Promise<IResult<ChatMemberResponse[]>>;
  addMembers(
    userId: number,
    chatId: number,
    request: AddChatMembersRequest,
  ): Promise<IResult<null>>;
  removeMembers(
    userId: number,
    chatId: number,
    request: RemoveChatMembersRequest,
  ): Promise<IResult<null>>;
}
