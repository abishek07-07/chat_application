import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, ArrayUnique, IsArray, IsUUID } from 'class-validator';

export class RemoveChatMembersRequest {
  @ApiProperty({
    description: 'Public identifiers of the users to remove from the chat',
    type: [String],
    example: ['b2d4f6e8-0a1c-4d3e-9f8a-7c6b5a4f3e2d'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsUUID('4', { each: true })
  memberIdentifiers!: string[];
}
