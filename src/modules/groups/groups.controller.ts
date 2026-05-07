import { Body, Controller, Post } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupChatDto } from '../chats/dto/create-group-chat.dto';
import { ChatsGateway } from '../chats/chats.gateway';

@Controller('groups')
export class GroupsController {
  constructor(
    private readonly groupsService: GroupsService,
    private readonly chatGateway: ChatsGateway,
  ) {}
  @Post()
  createGroupChat(@Body() createGroupChatDto: CreateGroupChatDto) {
    const newGroup = this.groupsService.createGroupChat(
      createGroupChatDto,
      createGroupChatDto.senderId,
    );
    this.chatGateway.emitNewGroupChatCreated(
      newGroup,
      createGroupChatDto.memberIds,
    );
    return newGroup;
  }
}
