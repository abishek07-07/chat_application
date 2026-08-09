import { Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '@src/features/auth/entity/users.entity';
import { Roles } from '@src/features/auth/entity/roles.entity';
import { Permissions } from '@src/features/auth/entity/permissions.entity';

@Global()
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('database.host'),
        port: Number(config.get<number>('database.port')),
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.name'),
        logging: true,
        autoLoadEntities: true,
        synchronize: true,
        entities: [Users, Roles, Permissions],
      }),
    }),
  ],
})
export class DatabaseModule {}
