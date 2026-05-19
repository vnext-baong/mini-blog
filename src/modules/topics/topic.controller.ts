import { Body, Controller, Get, Post } from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicListResponse, TopicResponse } from './types/topic.type';
import { MessageResponse } from 'src/common/types/response';
import { CreateTopicDto } from './dto/create-topic.dto';

@Controller('topics')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}
  @Get()
  getAllTopics(): Promise<TopicListResponse> {
    return this.topicService.getAllTopics();
  }
  @Post()
  createTopic(
    @Body() createTopicDto: CreateTopicDto,
  ): Promise<MessageResponse> {
    return this.topicService.createTopic(createTopicDto);
  }
}
