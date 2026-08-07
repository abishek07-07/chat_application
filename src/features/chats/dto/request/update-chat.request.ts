import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateChatRequest {
  @ApiProperty({
    description: 'New name for the group chat',
    example: 'Weekend Trip 2026',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;
}
