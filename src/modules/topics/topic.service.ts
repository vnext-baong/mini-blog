import { Injectable } from '@nestjs/common';
import { Topic } from 'src/database/entities/topic.entity';
import { Repository } from 'typeorm';
import { TopicListResponse } from './types/topic.type';
import { Message } from 'src/database/entities/message.entity';
import { MessageResponse } from 'src/common/types/response';
import { CreateTopicDto } from './dto/create-topic.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
  ) {}

  async getAllTopics(): Promise<TopicListResponse> {
    const [topics, total] = await this.topicRepository.findAndCount();
    return {
      items: topics,
      total,
    };
  }

  async createTopic(createTopicDto: CreateTopicDto): Promise<MessageResponse> {
    const topic = await this.topicRepository.findBy({
      name: createTopicDto.name,
    });
    if (topic) {
      return {
        statusCode: 400,
        message: 'Topic already exists',
      };
    }
    const newTopic = this.topicRepository.create(createTopicDto);
    await this.topicRepository.save(newTopic);
    return {
      statusCode: 201,
      message: 'Topic created successfully',
    };
  }
}
