import { UsePipes, ValidationPipe } from '@nestjs/common';

import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LoggingService } from '@src/utils/logging/logger.service';
import { JsonWebTokenService } from '@src/common/jsonwebtoken/jwt.service';
import { IJwtToken } from '@src/features/auth/services/auth.service';
import { mapuserIdSocketID } from '@src/main';
import { SEND_MESSAGE, TYPING_STARTED } from './constants';
import { SendMessageRequest } from './request/send-message.request';
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
@WebSocketGateway({})
export class MessagesGateway
  implements OnGatewayDisconnect, OnGatewayConnection
{
  @WebSocketServer() server!: Server;
  constructor(
    private readonly loggerService: LoggingService,
    private readonly jwtService: JsonWebTokenService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token;
    console.log('The handle connection is running', client.handshake);
    if (!token) throw new WsException('The token do not exists');

    const verification: IJwtToken = (await this.jwtService.decode(
      token,
    )) as IJwtToken;

    if (!verification)
      throw new WsException('The verification failed for the user ');

    // saving the data in the redis or map, for now map
    mapuserIdSocketID.set(verification.id, client.id);
  }

  handleDisconnect(client: Socket) {}

  @SubscribeMessage(SEND_MESSAGE)
  async sendMessage(
    client: Socket,
    @MessageBody() request: SendMessageRequest,
  ) {}

  @SubscribeMessage(TYPING_STARTED)
  async typingStarted() {}
}
