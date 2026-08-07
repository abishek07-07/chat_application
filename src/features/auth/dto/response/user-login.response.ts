import { UsersResponse } from '@src/common/entity/user-entity.dto';

export class UserLoginResponse {
  accessToken!: string;
  user!: UsersResponse;
}

export class UserLoginIntermediateResponse extends UserLoginResponse {
  refreshToken!: string;
}
