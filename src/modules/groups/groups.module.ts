import { Module } from '@nestjs/common';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { Group } from 'src/database/entities/groups.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from 'src/database/entities/members.entity';
import { ChatsModule } from '../chats/chats.module';
import { UsersModule } from '../users/users.module';
import { TokensModule } from '../tokens/tokens.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Group, Member]),
    ChatsModule,
    UsersModule,
    TokensModule,
  ],
  controllers: [GroupsController],
  providers: [GroupsService],
  exports: [GroupsService],
})
export class GroupsModule {}
