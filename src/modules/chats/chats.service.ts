import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatsService {
  createMessage(createChatDto: CreateChatDto, userId: string, name: string) {
    return {
      userId,
      name,
      content: createChatDto.content,
      timestamp: new Date(),
    };
  }
}
