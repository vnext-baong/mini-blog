import { Injectable } from '@nestjs/common';
import { Topic } from 'src/database/entities/topic.entity';
import { Repository } from 'typeorm';
import { TopicListResponse } from './types/topic.type';
import { MessageResponse } from 'src/common/types/response';
import { CreateTopicDto } from './dto/create-topic.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { slug } from 'src/utils/functions';

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
    const topic = await this.topicRepository.findOne({
      where: { name: createTopicDto.name },
    });

    if (topic) {
      return {
        statusCode: 400,
        message: 'Topic already exists',
      };
    }

    const slugTmp = slug(createTopicDto.name);
    const topicWithSlug = {
      ...createTopicDto,
      slug: slugTmp,
    };
    const newTopic = this.topicRepository.create(topicWithSlug);
    await this.topicRepository.save(newTopic);
    return {
      statusCode: 201,
      message: 'Topic created successfully',
    };
  }
}
