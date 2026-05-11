import { Controller, Get, Query } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuth } from 'src/common/decorators/jwt-auth.decorator';
import { GetMessageDto } from './dto/get-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}
  @Get()
  @JwtAuth()
  async getMessagesByGroupId(@Query() getMessageDto: GetMessageDto) {
    return this.messagesService.getMessagesByGroupId(getMessageDto);
  }
}
