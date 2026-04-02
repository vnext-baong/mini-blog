import { Expose } from 'class-transformer';
import { PaginationResponse } from 'src/common/types/pagination';

export class PostResponse {
  @Expose()
  title: string;
  @Expose()
  content: string;
  @Expose()
  slug: string;
  @Expose()
  authorId: string;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}

export class PostListResponse extends PaginationResponse<PostResponse> {}
