import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MessageType } from '../../entities/messages.entities';

export class SenderResponse {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  email!: string;

  @ApiProperty({ required: false })
  firstName!: string;

  @ApiProperty({ required: false })
  lastName!: string;
}

export class MessageReadResponse {
  @ApiProperty()
  userId!: number;

  @ApiProperty()
  seenAt!: Date;
}

export class MessageResponse {
  @ApiProperty({
    description: 'Opaque cryptographic key of the message, used as its id',
  })
  key!: string;

  @ApiProperty()
  chatId!: number;

  @ApiProperty()
  senderId!: number;

  @ApiProperty({ enum: MessageType })
  type!: MessageType;

  @ApiProperty({ required: false })
  message?: string;

  @ApiProperty({ required: false })
  attachmentUrl?: string;

  @ApiProperty()
  sentAt!: Date;

  @ApiProperty()
  isDeleted!: boolean;

  @ApiProperty()
  isEdited!: boolean;

  @ApiProperty({ required: false })
  editedAt?: Date;

  @ApiPropertyOptional({
    description: 'Opaque cryptographic key of the message being replied to',
  })
  replyToMessageKey?: string;

  @ApiPropertyOptional({ type: () => SenderResponse })
  sender?: SenderResponse;

  @ApiPropertyOptional({ type: () => MessageResponse })
  replyToMessage?: MessageResponse;

  @ApiProperty({ type: MessageReadResponse, isArray: true })
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
