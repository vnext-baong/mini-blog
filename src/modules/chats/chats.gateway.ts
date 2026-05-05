import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { User } from 'src/database/entities/user.entity';

@UseGuards(JwtAuthGuard)
@WebSocketGateway({
  namespace: 'chats',
  cors: true,
})
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatsGateway');
  constructor(
    private readonly chatsService: ChatsService,
    private readonly jwtAuthGuard: JwtAuthGuard,
  ) {}

  afterInit(server: Server) {
    this.logger.log('ChatsGateway initialized');
  }

  async handleConnection(client: Socket) {
    try {
      await this.jwtAuthGuard.canActivate({
        getType: () => 'ws',
        switchToWs: () => ({ getClient: () => client }),
      } as any);

      client.join('general_room');
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket & { user?: User },
    @MessageBody() payload: CreateChatDto,
  ) {
    const user = client.user;
    const message = this.chatsService.createMessage(
      payload,
      user?.id || client.id,
      user?.name || client.id,
    );
    console.log(payload);
    this.server.to('general_room').emit('receiveMessage', message);
    return message;
  }

  @SubscribeMessage('startTyping')
  handleStartTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    client.broadcast.to('general_room').emit('startTyping', data);
  }

  @SubscribeMessage('stopTyping')
  handleStopTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    client.broadcast.to('general_room').emit('stopTyping', data);
  }
}
