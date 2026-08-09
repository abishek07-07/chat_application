import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { MessageType } from '../../entities/messages.entities';

export class CreateMessageRequest {
  @ApiProperty({
    description: 'ID of the chat the message is sent to',
    example: 1,
  })
  @IsInt()
  @Min(1)
  chatId!: number;

  @ApiProperty({
    description: 'Type of the message',
    enum: MessageType,
    default: MessageType.TEXT,
  })
  @IsEnum(MessageType)
  type!: MessageType;

  @ApiPropertyOptional({
    description: 'Text content of the message. Required when type is text',
    example: 'Hello there!',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  message?: string;

  @ApiPropertyOptional({
    description: 'Attachment URL. Required when type is image or file',
    example: 'https://cdn.example.com/photo.jpg',
  })
  @IsOptional()
  @IsString()
  attachmentUrl?: string;

  @ApiPropertyOptional({
    description:
      'Opaque cryptographic key of the message being replied to (as returned by the API)',
    example: 'dGhpcy1pcy1hbi1vcGFxdWUta2V5',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  replyToMessageKey?: string;
}
