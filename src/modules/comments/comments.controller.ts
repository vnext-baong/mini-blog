import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CommentListResponse, CommentResponse } from './types/comment.type';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuth } from 'src/common/decorators/jwt-auth.decorator';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}
  @Get()
  getComment(@Query('postId') postId: string): Promise<CommentListResponse> {
    return this.commentService.getComments(postId);
  }
  @Post()
  @JwtAuth()
  createComment(
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CommentResponse> {
    return this.commentService.createComment(createCommentDto);
  }
}
