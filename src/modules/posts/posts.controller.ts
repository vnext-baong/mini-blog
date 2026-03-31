import { Body, Controller, Get, Post } from '@nestjs/common';
import { PostListResponse, PostResponse } from './types/post.type';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getPosts(): Promise<PostListResponse> {
    return this.postsService.getPosts();
  }

  @Post()
  async createPost(
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostResponse> {
    return this.postsService.createPost(createPostDto);
  }
}
