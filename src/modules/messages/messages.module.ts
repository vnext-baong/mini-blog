import { Module } from '@nestjs/common';
import { TokensModule } from '../tokens/tokens.module';
import { UsersModule } from '../users/users.module';
import { ChatsModule } from '../chats/chats.module';
import { Message } from 'src/database/entities/message.entity';
import { Group } from 'src/database/entities/groups.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { GroupsModule } from '../groups/groups.module';
import { GroupsService } from '../groups/groups.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Group]),
    ChatsModule,
    UsersModule,
    TokensModule,
    GroupsModule,
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
