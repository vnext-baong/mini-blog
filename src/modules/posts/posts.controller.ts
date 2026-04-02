import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PostListResponse, PostResponse } from './types/post.type';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { MessageResponse } from 'src/common/types/response';
import { Pagination } from 'src/common/types/pagination';
import { ApiQuery } from '@nestjs/swagger';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getPosts(
    @Query() pagination: Pagination,
    @Query('userId') userId: string,
    @Query('search') search: string,
  ): Promise<PostListResponse> {
    return this.postsService.getPosts(pagination, userId, search);
  }

  @Get(':slug')
  async getPostBySlug(@Param('slug') slug: string): Promise<PostResponse> {
    return this.postsService.getPostBySlug(slug);
  }

  @Get('id/:id')
  @ApiQuery({ name: 'id', required: true, type: String })
  async getPostById(@Param('id') id: string): Promise<PostResponse> {
    return this.postsService.getPostById(id);
  }

  @Post()
  async createPost(
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostResponse> {
    return this.postsService.createPost(createPostDto);
  }

  @Post('full-create')
  async fullCreatePost(
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostResponse> {
    return this.postsService.fullCreatePost(createPostDto);
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
