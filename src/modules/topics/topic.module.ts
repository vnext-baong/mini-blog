import { forwardRef, Module } from '@nestjs/common';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic } from 'src/database/entities/topic.entity';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [TypeOrmModule.forFeature([Topic]), forwardRef(() => PostsModule)],
  controllers: [TopicController],
  providers: [TopicService],
})
export class TopicModule {}
