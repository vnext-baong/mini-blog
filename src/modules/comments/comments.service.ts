import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/database/entities/comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentResponse } from './types/comment.type';
import { PostsService } from '../posts/posts.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly userService: UsersService,
    private readonly postService: PostsService,
  ) {}

  async createComment(
    createCommentDto: CreateCommentDto,
  ): Promise<CommentResponse> {
    try {
      const { postId, authorId } = createCommentDto;
      const post = await this.postService.getPostById(postId);
      const author = await this.userService.findOne(authorId);
      if (!post) {
        throw new Error('Post not found');
      }
      if (!author) {
        throw new Error('Author not found');
      }
      const comment = this.commentRepository.create(createCommentDto);
      return await this.commentRepository.save(comment);
    } catch (error) {
      throw error;
    }
  }
}
