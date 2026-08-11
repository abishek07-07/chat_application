import { Module, OnModuleInit } from '@nestjs/common';
import { WinstonModule } from '@src/utils/logging/winston.module';
import { MessagesGateway } from './messages.sockets';
import { JsonWebTokenModule } from '@src/common/jsonwebtoken/jwt.module';

@Module({
  imports: [WinstonModule, JsonWebTokenModule],
  providers: [MessagesGateway],
  exports: [],
})
export class SocketModule {}
