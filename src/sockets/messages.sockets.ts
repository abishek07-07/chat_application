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
import { MESSAGE_FROM_SERVER, SEND_MESSAGE, TYPING_STARTED } from './constants';
import { SendMessageRequest } from './request/send-message.request';
import { MessageSocketService } from './services/send-message.service';
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
@WebSocketGateway({
  cors:{
    origin : "http://localhost:8080", 
    credentials : true 
  }
})
export class MessagesGateway
  implements OnGatewayDisconnect, OnGatewayConnection
{
  @WebSocketServer() server!: Server;
  constructor(
    private readonly loggerService: LoggingService,
    private readonly jwtService: JsonWebTokenService,
    private readonly messageService: MessageSocketService,
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
    client.user = verification.id;
    // saving the data in the redis or map, for now map
    mapuserIdSocketID.set(verification.id, client.id);
  }

  handleDisconnect(client: Socket) {}

  @SubscribeMessage(SEND_MESSAGE)
  async sendMessage(
    client: Socket,
    @MessageBody() request: SendMessageRequest,
  ) {
    request.senderId = client.user;
    const response = await this.messageService.sendMessage(request);
    client.to(request.chatId.toString()).emit(MESSAGE_FROM_SERVER, response);
  }

  @SubscribeMessage(TYPING_STARTED)
  async typingStarted() {}
}
