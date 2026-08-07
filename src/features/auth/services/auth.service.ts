import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { IAuthService } from './interface';
import { UserRepository } from '../respository/users.repository';
import { UserLoginRequest } from '../dto/request/user-login.request';
import { UserRegisterRequest } from '../dto/request/user-register.request';
import {
  UserLoginIntermediateResponse,
  UserLoginResponse,
} from '../dto/response/user-login.response';
import { Hashing } from '@src/utils/hashing/bcrypt';
import { JsonWebTokenService } from '@src/common/jsonwebtoken/jwt.service';
import { plainToInstance } from 'class-transformer';
import { UsersResponse } from '@src/common/entity/user-entity.dto';
import { IResult } from '@src/utils/responses/SuccessfulResponse';
import { Results } from '@src/utils/responses/SuccessfulResponse';
import { RolesRepository } from '../respository/roles.repository';
import { RolesConstants } from '../constants/permissions.constants';
import { Users } from '../entity/users.entity';
export interface IJwtToken {
  email: string;
  id: number;
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JsonWebTokenService,
    private readonly rolesRepository: RolesRepository,
  ) {}

  async loginUser(
    request: UserLoginRequest,
  ): Promise<UserLoginIntermediateResponse> {
    const userwithMailExists = await this.userRepository.findUserByEmail(
      request.email,
    );
    if (!userwithMailExists)
      throw new BadRequestException('Invalid Credentials');

    // validation of password

    const isPasswordCorrect = Hashing.compareData(
      request.password,
      userwithMailExists.password,
    );

    if (!isPasswordCorrect)
      throw new BadRequestException('Invalid Credentials');

    // creating the access token and the refresh token

    const accesstoken = await this.jwtService.sign<IJwtToken>({
      email: userwithMailExists.email,
      id: userwithMailExists.id,
    });

    const refreshtoken = await this.jwtService.signWithOptions<IJwtToken>(
      {
        email: userwithMailExists.email,
        id: userwithMailExists.id,
      },
      {
        expiresIn: 1000 * 60 * 60 * 24 * 15, // 15 days
      },
    );
    const response = new UserLoginIntermediateResponse();
    response.accessToken = accesstoken;
    response.user = plainToInstance(UsersResponse, userwithMailExists, {
      excludeExtraneousValues: true,
    });
    response.refreshToken = refreshtoken;

    return response;
  }

  async registerUser(request: UserRegisterRequest): Promise<IResult<null>> {
    try {
      const userExists = await this.userRepository.findUserByEmail(
        request.email,
      );

      if (userExists)
        throw new BadRequestException('User with the same mail already exists');

      const findrole = await this.rolesRepository.findRoleByAbbr(
        RolesConstants.USERS,
      );

      if (!findrole)
        throw new InternalServerErrorException(
          'The role required in the userRegistration do not exists ',
        );

      await this.userRepository.saveUser(
        {
          firstName: request.firstName,
          lastName: request.lastName,
          email: request.email,
          password: Hashing.hashData(request.password),
        },
        findrole,
      );

      return Results('User registered Successfully', null);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
