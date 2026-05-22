import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/database/entities/post.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { UsersModule } from '../users/users.module';
import { CommentsModule } from '../comments/comments.module';
import { TokensModule } from '../tokens/tokens.module';
import { TopicModule } from '../topics/topic.module';
import { CloudinaryService } from 'src/helpers/cloudinary.helper';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    forwardRef(() => CommentsModule),
    UsersModule,
    TokensModule,
    forwardRef(() => TopicModule),
  ],
  controllers: [PostsController],
  providers: [PostsService, CloudinaryService],
  exports: [PostsService],
})
export class PostsModule {}
