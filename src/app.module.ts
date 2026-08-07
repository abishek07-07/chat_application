import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from '@config/jwt.config';
import swaggerConfig from '@config/swagger.config';
import { WinstonModule as WnModule } from './utils/logging/winston.module';
import { DatabaseModule } from './common/database/database.module';
import databaseConfig from '@config/database.config';
import dotenv from 'dotenv';
import { JsonWebTokenModule } from './common/jsonwebtoken/jwt.module';
import { AuthModule } from './features/auth/auth.module';
dotenv.config();
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      load: [jwtConfig, swaggerConfig, databaseConfig],
    }),
    DatabaseModule,
    WnModule,
    JsonWebTokenModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
