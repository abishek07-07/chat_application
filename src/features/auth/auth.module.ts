import { Module } from '@nestjs/common';
import { DatabaseModule } from '@src/common/database/database.module';
import { JsonWebTokenModule } from '@src/common/jsonwebtoken/jwt.module';
import { UserRepository } from './respository/users.repository';
import { RolesRepository } from './respository/roles.repository';
import { AuthService } from './services/auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permissions } from './entity/permissions.entity';
import { Roles } from './entity/roles.entity';
import { Users } from './entity/users.entity';

@Module({
  imports: [
    DatabaseModule,
    JsonWebTokenModule,
    TypeOrmModule.forFeature([Users, Roles, Permissions]),
  ],
  providers: [
    UserRepository,
    RolesRepository,
    AuthService,
    JwtAuthGuard,
    JwtStrategy,
  ],
  exports: [
    AuthService,
    UserRepository,
    RolesRepository,
    JwtAuthGuard,
    JwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
