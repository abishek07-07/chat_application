import { UsersResponse } from '@src/common/entity/user-entity.dto';
import { MessageType } from '@src/features/messages/entities/messages.entities';

export class SendMessageResponse {
  chatId!: number;
  sender!: UsersResponse;
  message!: string;
  messageType!: MessageType;
  attachment!: string; // we can save the buffer in the cloudinary or also save as the buffer
}
