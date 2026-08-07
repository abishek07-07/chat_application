import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UserRegisterRequest } from './dto/request/user-register.request';
import { UserLoginRequest } from './dto/request/user-login.request';
import { type Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { UserLoginResponse } from './dto/response/user-login.response';
import { Results } from '@src/utils/responses/SuccessfulResponse';

import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const REFRESH_TOKEN = 'REFRESH_TOKEN';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Creates a new user account.',
  })
  @ApiBody({
    type: UserRegisterRequest,
  })
  @ApiCreatedResponse({
    description: 'User registered successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed or email already exists.',
  })
  async registerUser(@Body() request: UserRegisterRequest) {
    return this.authService.registerUser(request);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login user',
    description:
      'Authenticates a user and stores the refresh token in an HttpOnly cookie.',
  })
  @ApiBody({
    type: UserLoginRequest,
  })
  @ApiOkResponse({
    description: 'Login successful.',
    type: UserLoginResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid email or password.',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed.',
  })
  @ApiCookieAuth(REFRESH_TOKEN)
  async loginUser(
    @Body() data: UserLoginRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    const intermediateRes = await this.authService.loginUser(data);

    response.cookie(REFRESH_TOKEN, intermediateRes.refreshToken, {
      httpOnly: this.configService.get<boolean>('cookie.httpOnly'),
      secure: this.configService.get<boolean>('cookie.secure'),
      maxAge: this.configService.get<number>('cookie.maxAge'),
    });

    const res = plainToInstance(UserLoginResponse, intermediateRes, {
      excludeExtraneousValues: true,
    });

    return Results('User Login Successful', res);
  }
}
