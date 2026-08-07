import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class SendFriendRequest {
  @ApiProperty({
    description: 'Public identifier of the user to send the friend request to',
    example: 'b2d4f6e8-0a1c-4d3e-9f8a-7c6b5a4f3e2d',
  })
  @IsUUID()
  @IsNotEmpty()
  receiverIdentifier!: string;
}
