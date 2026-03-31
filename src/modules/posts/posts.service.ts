import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/database/entities/post.entity';
import { PostListResponse, PostResponse } from './types/post.type';
import { IsNull, Not, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UsersService } from '../users/users.service';
import { slug } from 'src/utils/functions';
import { MessageResponse } from 'src/common/types/response';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly userService: UsersService,
  ) {}
  async getPosts(): Promise<PostListResponse> {
    const [items, total] = await this.postRepository.findAndCount();
    return {
      items,
      total,
    };
  }
  async getPostBySlug(slug: string): Promise<PostResponse> {
    const post = await this.postRepository.findOne({
      where: { slug, deletedAt: IsNull() },
    });
    if (!post) {
      throw new Error('Post not found');
    }
    return post;
  }

  async getPostById(id: string): Promise<PostResponse> {
    const post = await this.postRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
    if (!post) {
      throw new Error('Post not found');
    }
    return post;
  }

  async createPost(createPostDto: CreatePostDto): Promise<PostResponse> {
    try {
      const userId = createPostDto.authorId;
      const user = await this.userService.findOne(userId);
      if (!user) {
        throw new Error('Author not found');
      }
      const slugtmp = slug(createPostDto.title);
      const slugExists = await this.postRepository.findOne({
        where: { slug: slugtmp },
      });
      if (slugExists) {
        throw new Error('A post with the same title already exists');
      }
      const post = {
        slug: slugtmp,
        published: false,
        ...createPostDto,
        authorId: user.id,
      };
      const newPost = this.postRepository.create(post);
      return await this.postRepository.save(newPost);
    } catch (error) {
      throw new Error('Failed to create post');
    }
  }
  async updatePost(
    id: string,
    updatePostDto: CreatePostDto,
  ): Promise<PostResponse> {
    try {
      const post = await this.postRepository.findOne({
        where: { id, deletedAt: IsNull(), published: false },
      });
      if (!post) {
        throw new Error('Post not found');
      }
      const userId = updatePostDto.authorId;
      const user = await this.userService.findOne(userId);
      if (!user) {
        throw new Error('Author not found');
      }
      const slugtmp = slug(updatePostDto.title);
      const slugExists = await this.postRepository.findOne({
        where: { slug: slugtmp, id: Not(id) },
      });
      if (slugExists) {
        throw new Error('A post with the same title already exists');
      }
      post.title = updatePostDto.title;
      post.content = updatePostDto.content;
      post.slug = slugtmp;
      post.authorId = user.id;

      return await this.postRepository.save(post);
    } catch (error) {
      throw new Error('Failed to update post');
    }
  }
  async softDeletePost(id: string): Promise<MessageResponse> {
    try {
      const post = await this.postRepository.findOne({
        where: { id, deletedAt: IsNull() },
      });
      if (!post) {
        throw new Error('Post not found');
      }
      await this.postRepository.update(id, { deletedAt: new Date() });
      return {
        statusCode: HttpStatus.OK,
        message: 'Post deleted successfully',
      };
    } catch (error) {
      throw error;
    }
  }
  async publishPost(id: string): Promise<MessageResponse> {
    try {
      const post = await this.postRepository.findOne({
        where: { id, deletedAt: IsNull(), published: false },
      });
      if (!post) {
        throw new Error('Post not found or already published');
      }
      await this.postRepository.update(id, { published: true });
      return {
        statusCode: HttpStatus.OK,
        message: 'Post published successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}
