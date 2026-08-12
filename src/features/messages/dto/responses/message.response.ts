import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { MessageType } from '../../entities/messages.entities';

export class SenderResponse {
  @ApiProperty()
  @Expose()
  id!: number;

  @ApiProperty()
  @Expose()
  email!: string;

  @ApiProperty({ required: false })
  @Expose()
  firstName!: string;

  @ApiProperty({ required: false })
  @Expose()
  lastName!: string;
}

export class MessageReadResponse {
  @ApiProperty()
  @Expose()
  userId!: number;

  @ApiProperty()
  @Expose()
  seenAt!: Date;
}

export class MessageResponse {
  @ApiProperty({
    description: 'Opaque cryptographic key of the message, used as its id',
  })
  @Expose()
  key!: string;

  @ApiProperty()
  @Expose()
  chatId!: number;

  @ApiProperty()
  @Expose()
  senderId!: number;

  @ApiProperty({ enum: MessageType })
  @Expose()
  type!: MessageType;

  @ApiProperty({ required: false })
  @Expose()
  message?: string;

  @ApiProperty({ required: false })
  @Expose()
  attachmentUrl?: string;

  @ApiProperty()
  @Expose()
  sentAt!: Date;

  @ApiProperty()
  @Expose()
  isDeleted!: boolean;

  @ApiProperty()
  @Expose()
  isEdited!: boolean;

  @ApiProperty({ required: false })
  @Expose()
  editedAt?: Date;

  @ApiPropertyOptional({
    description: 'Opaque cryptographic key of the message being replied to',
  })
  @Expose()
  replyToMessageKey?: string;

  @ApiPropertyOptional({ type: () => SenderResponse })
  @Expose()
  @Type(() => SenderResponse)
  sender?: SenderResponse;

  @ApiPropertyOptional({ type: () => MessageResponse })
  @Expose()
  @Type(() => MessageResponse)
  replyToMessage?: MessageResponse;

  @ApiProperty({ type: MessageReadResponse, isArray: true })
  @Expose()
  @Type(() => MessageReadResponse)
  reads!: MessageReadResponse[];
}

export class PaginatedMessageResponse {
  @ApiProperty({ type: MessageResponse, isArray: true })
  items!: MessageResponse[];

  @ApiProperty({
    description:
      'Opaque cursor used to fetch the next page, null when there are no more messages',
    nullable: true,
  })
  nextCursor!: string | null;

  @ApiProperty()
  hasMore!: boolean;
}
