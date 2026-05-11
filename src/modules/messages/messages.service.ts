import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from 'src/database/entities/groups.entity';
import { Message } from 'src/database/entities/message.entity';
import { Repository } from 'typeorm';
import { GroupsService } from '../groups/groups.service';
import { Pagination } from 'src/common/types/pagination';
import { GetMessageDto } from './dto/get-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly groupService: GroupsService,
  ) {}
  async getMessagesByGroupId(getMessageDto: GetMessageDto) {
    const group = await this.groupService.getGroupById(getMessageDto.groupId);
    if (!group) {
      throw new Error('Group not found');
    }
    return this.messageRepository.find({
      where: { groupId: getMessageDto.groupId },
      order: { createdAt: 'DESC' },
      skip: (getMessageDto.page - 1) * getMessageDto.limit,
      take: getMessageDto.limit,
    });
  }
}
