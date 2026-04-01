import { Expose } from 'class-transformer';
import { PaginationResponse } from 'src/common/types/pagination';

export class CommentResponse {
  @Expose()
  id: string;
  @Expose()
  content: string;
  @Expose()
  postId: string;
  @Expose()
  authorId: string;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}

export class CommentListResponse extends PaginationResponse<CommentResponse> {}
