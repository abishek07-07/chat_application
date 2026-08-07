import { IResult } from '@src/utils/responses/SuccessfulResponse';
import { UserLoginRequest } from '../dto/request/user-login.request';
import { UserRegisterRequest } from '../dto/request/user-register.request';
import {
  UserLoginIntermediateResponse,
  UserLoginResponse,
} from '../dto/response/user-login.response';

export interface IAuthService {
  loginUser(
    request: UserLoginRequest,
  ): Promise<UserLoginIntermediateResponse>;
  registerUser(request: UserRegisterRequest): Promise<IResult<null>>;
}
