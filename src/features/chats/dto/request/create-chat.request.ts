import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ChatType } from '../../entities/chat.entities';

export class CreateChatRequest {
  @ApiProperty({
    description: 'Type of the chat to create',
    enum: ChatType,
    example: ChatType.SINGLE,
  })
  @IsEnum(ChatType)
  @IsNotEmpty()
  type!: ChatType;

  @ApiProperty({
    description: 'Name of the chat. Required when type is group',
    example: 'Weekend Trip',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({
    description:
      'Public identifier of the other participant. Required when type is single',
    example: 'b2d4f6e8-0a1c-4d3e-9f8a-7c6b5a4f3e2d',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  @IsNotEmpty()
  participantIdentifier?: string;

  @ApiProperty({
    description:
      'Public identifiers of additional members. For group chats only',
    type: [String],
    example: ['b2d4f6e8-0a1c-4d3e-9f8a-7c6b5a4f3e2d'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  memberIdentifiers?: string[];
}
