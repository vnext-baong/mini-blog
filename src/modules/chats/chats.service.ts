import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/database/entities/message.entity';
import { Repository } from 'typeorm';
import { Group } from 'src/database/entities/groups.entity';
import { Member } from 'src/database/entities/members.entity';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}
  createChat(
    createChatDto: CreateChatDto,
    senderId: string,
    senderName: string,
  ) {
    const newChat = this.messageRepository.create({
      ...createChatDto,
      senderId,
      senderName,
    });

    return this.messageRepository.save(newChat);
  }
}
