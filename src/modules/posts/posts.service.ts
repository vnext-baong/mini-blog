import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/database/entities/post.entity';
import { PostListResponse, PostResponse } from './types/post.type';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UsersService } from '../users/users.service';
import { slug } from 'src/utils/functions';

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

  async createPost(createPostDto: CreatePostDto): Promise<PostResponse> {
    try {
      const userId = createPostDto.authorId;
      const user = await this.userService.findOne(userId);
      if (!user) {
        throw new Error('Author not found');
      }
      const post = {
        slug: slug(createPostDto.title),
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
}
