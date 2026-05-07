import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { UsersModule } from '../users/users.module';
import { TokensModule } from '../tokens/tokens.module';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/database/entities/message.entity';
import { Group } from 'src/database/entities/groups.entity';
import { Member } from 'src/database/entities/members.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Group, Member]),
    UsersModule,
    TokensModule,
  ],
  providers: [ChatsGateway, ChatsService, JwtAuthGuard],
  exports: [ChatsGateway],
})
export class ChatsModule {}
