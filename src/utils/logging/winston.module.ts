import { Global, Module } from '@nestjs/common';
import { WinstonModule as WinstonDocModule, utilities } from 'nest-winston';
import * as winston from 'winston';
import { LoggingService } from './logger.service';

@Global()
@Module({
  imports: [
    WinstonDocModule.forRoot({
      level: 'info',

      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            winston.format.colorize(),
            utilities.format.nestLike('Messaging app', {
              colors: true,
              prettyPrint: true,
              processId: true,
              appName: true,
            }),
          ),
        }),

        new winston.transports.File({
          filename: './logs/error.log',
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),

        new winston.transports.File({
          filename: './logs/combined.log',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
      ],
    }),
  ],

  providers: [LoggingService],
  exports: [LoggingService],
})
export class WinstonModule {}
