import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupType, UserRole } from 'src/common/constants/enum';
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
  async getGroupsForUser(userId: string) {
    try {
      const groups = await this.groupsRepository
        .createQueryBuilder('group')
        .innerJoin(
          'members',
          'member',
          'member.groupId = group.id AND member.userId = :userId',
          { userId },
        )
        .getMany();
      return groups;
    } catch (error) {
      throw error;
    }
  }
  async getGroupById(groupId: string) {
    try {
      const group = await this.groupsRepository.findOne({
        where: { id: groupId },
        relations: ['members'],
      });
      return group;
    } catch (error) {
      throw error;
    }
  }

  async getOrCreatePrivateGroup(currentUserId: string, targetUserId: string) {
    try {
      const existingGroup = await this.groupsRepository
        .createQueryBuilder('group')
        .innerJoin('group.members', 'm1', 'm1.userId = :currentUserId', {
          currentUserId,
        })
        .innerJoin('group.members', 'm2', 'm2.userId = :targetUserId', {
          targetUserId,
        })
        .where('group.type = :type', { type: GroupType.PRIVATE })
        .getOne();

      if (existingGroup) {
        return { group: existingGroup, isNew: false };
      }

      const newGroup = this.groupsRepository.create({
        name: 'Private Chat',
        type: GroupType.PRIVATE,
      });
      const savedGroup = await this.groupsRepository.save(newGroup);

      const [currentUser, targetUser] = await Promise.all([
        this.userService.findOne(currentUserId),
        this.userService.findOne(targetUserId),
      ]);

      const members = this.memberRepository.create([
        {
          groupId: savedGroup.id,
          userId: currentUserId,
          name: currentUser?.name || 'Unknown',
          role: UserRole.USER,
        },
        {
          groupId: savedGroup.id,
          userId: targetUserId,
          name: targetUser?.name || 'Unknown',
          role: UserRole.USER,
        },
      ]);

      await this.memberRepository.save(members);

      return { group: savedGroup, isNew: true };
    } catch (error) {
      console.error('Error creating private group:', error);
      throw error;
    }
  }
}
