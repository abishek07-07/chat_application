import { UsersResponse } from '@src/common/entity/user-entity.dto';
import { Expose, Type } from 'class-transformer';

export class UserLoginResponse {
  @Expose()
  accessToken!: string;

  @Expose()
  @Type(() => UsersResponse)
  user!: UsersResponse;
}

export class UserLoginIntermediateResponse extends UserLoginResponse {
  refreshToken!: string;
}
