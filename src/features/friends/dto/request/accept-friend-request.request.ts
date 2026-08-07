import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class AcceptFriendRequest {
  @ApiProperty({
    description: 'Id of the friend request to accept or reject',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  requestId!: number;
}
