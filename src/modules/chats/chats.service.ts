import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatsService {
  createMessage(createChatDto: CreateChatDto, clientId: string) {
    return {
      clientId,
      content: createChatDto.content,
      timestamp: new Date(),
    };
  }
}
