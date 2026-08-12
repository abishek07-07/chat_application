import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ChatType } from '../../entities/chat.entities';
import { ChatMemberResponse } from './chat-member.response';
import { MessageResponse } from '@src/features/messages/dto/responses/message.response';

export class ChatResponse {
  @ApiProperty()
  @Expose()
  id!: number;

  @ApiProperty({ enum: ChatType })
  @Expose()
  type!: ChatType;

  @ApiProperty({ required: false })
  @Expose()
  name?: string;

  @ApiProperty()
  @Expose()
  createdAt!: Date;

  @ApiProperty({ type: ChatMemberResponse, isArray: true })
  @Expose()
  @Type(() => ChatMemberResponse)
  members!: ChatMemberResponse[];

  @Expose()
  @Type(() => MessageResponse)
  messages!: MessageResponse[];
}
