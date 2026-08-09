import {
  CallHandler,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PermissionsInterceptor } from './get-permissions.interceptor';
import { UserRepository } from '../respository/users.repository';
import { Users } from '../entity/users.entity';
import { Roles } from '../entity/roles.entity';
import { Permissions } from '../entity/permissions.entity';
import { Schemas } from '@src/common/database/database.constants';
import dotenv from 'dotenv';
dotenv.config({
  path: '.env',
});

describe('PermissionsInterceptor', () => {
  let module: TestingModule;
  let permissionInterceptor: PermissionsInterceptor;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          port: 5432,
          host: 'localhost',
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
          schema: Schemas.AUTH,
          entities: [Users, Roles, Permissions],
          synchronize: true,
        }),

        TypeOrmModule.forFeature([Users, Roles, Permissions]),
      ],

      providers: [PermissionsInterceptor, UserRepository],
    }).compile();

    permissionInterceptor = module.get<PermissionsInterceptor>(
      PermissionsInterceptor,
    );
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(permissionInterceptor).toBeDefined();
  });

  it('should get permissions from the database', async () => {
    const request = {
      user: {
        id: 1,
        email: 'abishek112@gmail.com',
      },
    };

    const context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(request),
      }),
    } as unknown as ExecutionContext;

    const next: CallHandler = {
      handle: jest.fn().mockReturnValue({
        pipe: jest.fn(),
      }),
    };

    const result = await permissionInterceptor.intercept(context, next);

    expect(request.permissions).toBeDefined();
    expect(next.handle).toHaveBeenCalled();
  });

  it('should throw the unauthorized error', async () => {
    const request = {
      user: {
        id: 100,
        email: 'abishek112@gmail.com',
      },
    };

    const ctx: ExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(request),
      }),
    } as unknown as ExecutionContext;

    const next: CallHandler = {
      handle: jest.fn().mockReturnValue({
        pipe: jest.fn(),
      }),
    };

    await expect(permissionInterceptor.intercept(ctx, next)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
