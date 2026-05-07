import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from 'src/common/constants/enum';
import { Group } from 'src/database/entities/groups.entity';
import { Repository } from 'typeorm';
import { CreateGroupChatDto } from '../chats/dto/create-group-chat.dto';
import { Member } from 'src/database/entities/members.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupsRepository: Repository<Group>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    private readonly userService: UsersService,
  ) {}
  async createGroupChat(
    createGroupChatDto: CreateGroupChatDto,
    senderId: string,
  ) {
    try {
      const { name, type, memberIds } = createGroupChatDto;

      const newGroup = this.groupsRepository.create({
        name,
        type,
      });
      const savedGroup = await this.groupsRepository.save(newGroup);
      if (!savedGroup) {
        throw new Error('Failed to create group chat');
      }
      const membersIds = Array.from(new Set([...memberIds, senderId]));
      const tmpMembers = await Promise.all(
        membersIds.map((memberId) => this.userService.findOne(memberId)),
      );
      const userMap = new Map(tmpMembers.map((user) => [user.id, user.name]));
      const members = membersIds.map((memberId) => {
        return this.memberRepository.create({
          groupId: savedGroup.id,
          userId: memberId,
          name: userMap.get(memberId),
          role: memberId === senderId ? UserRole.ADMIN : UserRole.USER,
        });
      });

      const savedMembers = await this.memberRepository.save(members);
      if (!savedMembers) {
        throw new Error('Failed to add members to group chat');
      }
      return savedGroup;
    } catch (error) {
      console.error('Error creating group chat:', error);
      throw error;
    }
  }
}
