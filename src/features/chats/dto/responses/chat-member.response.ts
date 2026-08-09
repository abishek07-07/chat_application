import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UsersResponse } from '@src/common/entity/user-entity.dto';

export class ChatMemberResponse {
  @ApiProperty()
  @Expose()
  chatId!: number;

  @ApiProperty()
  @Expose()
  userId!: number;

  @ApiProperty({ required: false })
  @Expose()
  alias?: string;

  @ApiProperty()
  @Expose()
  isAdmin!: boolean;

  @ApiProperty()
  @Expose()
  joinedAt!: Date;

  @ApiProperty({ type: UsersResponse })
  @Expose()
  @Type(() => UsersResponse)
  user!: UsersResponse;
}
