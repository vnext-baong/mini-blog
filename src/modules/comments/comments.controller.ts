import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommentResponse } from './types/comment.type';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}
  @Post()
  createComment(
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CommentResponse> {
    return this.commentService.createComment(createCommentDto);
  }
}
