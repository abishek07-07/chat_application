import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UsersResponse } from '@src/common/entity/user-entity.dto';

export class FriendListResponse {
  @ApiProperty()
  @Expose()
  id!: number;

  @ApiProperty()
  @Expose()
  createdAt!: Date;

  @ApiProperty({ type: UsersResponse })
  @Expose()
  @Type(() => UsersResponse)
  friend!: UsersResponse;
}
