import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/database/entities/post.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { UsersModule } from '../users/users.module';
import { CommentsModule } from '../comments/comments.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), forwardRef(() => CommentsModule), UsersModule],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
