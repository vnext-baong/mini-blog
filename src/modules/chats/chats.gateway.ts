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

      if (client.id) {
        client.join(client.id);
        this.logger.log(
          `Client connected: ${client.id} (User ID: ${client.id})`,
        );
      }
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
    const message = await this.chatsService.createChat(
      payload,
      user?.id || client.id,
      user?.name || client.id,
    );

    this.server.to(payload.groupId).emit('receiveMessage', message);
    return message;
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string,
  ) {
    client.join(room);
    this.logger.log(`Client ${client.id} joined room ${room}`);
    console.log(`Client ${client.id} joined room ${room}`);
  }

  emitNewGroupChatCreated(group: any, memberIds: string[]) {
    memberIds.forEach((memberId) => {
      this.server.to(memberId).emit('newGroupChatCreated', group);
    });
  }

  @SubscribeMessage('startTyping')
  handleStartTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { groupId: string; name: string },
  ) {
    client.broadcast.to(data.groupId).emit('startTyping', data);
  }

  @SubscribeMessage('stopTyping')
  handleStopTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { groupId: string; name: string },
  ) {
    client.broadcast.to(data.groupId).emit('stopTyping', data);
  }
}
