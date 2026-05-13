import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupChatDto } from '../chats/dto/create-group-chat.dto';
import { ChatsGateway } from '../chats/chats.gateway';
import { JwtAuth } from 'src/common/decorators/jwt-auth.decorator';

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
  @Get()
  @JwtAuth()
  getGroupsForUser(@Query('userId') userId: string) {
    return this.groupsService.getGroupsForUser(userId);
  }

  @Post('private/:targetUserId')
  @JwtAuth()
  async getOrCreatePrivateChat(
    @Param('targetUserId') targetUserId: string,
    @Req() req: any,
  ) {
    const currentUserId = req.userLogged.id;
    const { group, isNew } = await this.groupsService.getOrCreatePrivateGroup(
      currentUserId,
      targetUserId,
    );

    if (isNew) {
      this.chatGateway.emitNewGroupChatCreated(group, [
        targetUserId,
        currentUserId,
      ]);
    }
    return group;
  }
}
