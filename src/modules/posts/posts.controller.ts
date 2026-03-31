import { Controller, Get } from '@nestjs/common';
import { PostListResponse } from './types/post.type';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
}
