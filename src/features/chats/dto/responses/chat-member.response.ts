import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UsersResponse } from '@src/common/entity/user-entity.dto';
import { MessageType } from '@src/features/messages/entities/messages.entities';

export class ChatMemberResponse {
  @ApiProperty({ required: false })
  @Expose()
  alias?: string;

  @ApiProperty()
  @Expose()
  isAdmin!: boolean;

  @ApiProperty()
  @Expose()
  joinedAt!: Date;

  @ApiProperty({ type: UsersResponse })
  @Expose()
  @Type(() => UsersResponse)
  user!: UsersResponse;
}

import { IsEnum, IsInt, IsOptional, IsString, IsUrl } from 'class-validator';

export class MessagesResponse {
  @Expose()
  @IsString()
  id!: string;

  @Expose()
  @IsEnum(MessageType)
  type!: MessageType;

  @Expose()
  @IsOptional()
  @IsString()
  message?: string;

  @Expose()
  @IsUrl()
  attachmentUrl!: string;

  @Expose()
  @IsString()
  sentAt!: string;

  @Expose()
  @IsOptional()
  @IsInt()
  replyToMessageId?: number;

  @Expose()
  sender!: UsersResponse;
}
