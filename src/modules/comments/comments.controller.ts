import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CommentListResponse, CommentResponse } from './types/comment.type';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}
  @Get()
  getComment(@Query('postId') postId: string): Promise<CommentListResponse> {
    return this.commentService.getComments(postId);
  }
  @Post()
  createComment(
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CommentResponse> {
    return this.commentService.createComment(createCommentDto);
  }
}
