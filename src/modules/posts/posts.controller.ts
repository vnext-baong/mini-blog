import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PostListResponse, PostResponse } from './types/post.type';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { MessageResponse } from 'src/common/types/response';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getPosts(): Promise<PostListResponse> {
    return this.postsService.getPosts();
  }

  @Get(':slug')
  async getPostBySlug(@Param('slug') slug: string): Promise<PostResponse> {
    return this.postsService.getPostBySlug(slug);
  }

  @Get('id/:id')
  async getPostById(@Param('id') id: string): Promise<PostResponse> {
    return this.postsService.getPostById(id);
  }

  @Post()
  async createPost(
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostResponse> {
    return this.postsService.createPost(createPostDto);
  }

  @Patch(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostResponse> {
    return this.postsService.updatePost(id, updatePostDto);
  }

  @Patch('delete/:id')
  async softDeletePost(@Param('id') id: string): Promise<HttpStatus> {
    await this.postsService.softDeletePost(id);
    return HttpStatus.OK;
  }

  @Patch('publish/:id')
  async publishPost(@Param('id') id: string): Promise<MessageResponse> {
    return await this.postsService.publishPost(id);
  }
}
