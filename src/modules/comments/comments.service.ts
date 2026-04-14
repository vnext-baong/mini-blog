import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/database/entities/comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentListResponse, CommentResponse } from './types/comment.type';
import { PostsService } from '../posts/posts.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly userService: UsersService,
    @Inject(forwardRef(() => PostsService))
    private readonly postService: PostsService,
  ) {}

  async getComments(postId: string): Promise<CommentListResponse> {
    try {
      const post = await this.postService.getPostById(postId);
      if (!post) {
        throw new Error('Post not found');
      }
      const [items, total] = await this.commentRepository.findAndCount({
        relations: ['author'],
        select: {
          id: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          author: {
            id: true,
            name: true,
          },
        },
        where: { postId },
        order: { createdAt: 'DESC' },
      });

      return {
        items: items,
        total: total,
      };
    } catch (error) {
      throw error;
    }
  }

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
