import { MessageType } from '@src/features/messages/entities/messages.entities';
import { IsNumber } from 'class-validator';

export class SendMessageRequest {
  @IsNumber()
  chatId!: number;
  senderId?: number;
  message!: string;
  messageType!: MessageType;
  attachment!: Buffer;
}
