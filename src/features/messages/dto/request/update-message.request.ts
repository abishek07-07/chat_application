import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateMessageRequest {
  @ApiProperty({
    description: 'New content of the message',
    example: 'Corrected message',
  })
  @IsString()
  @IsNotEmpty()
  message!: string;
}
