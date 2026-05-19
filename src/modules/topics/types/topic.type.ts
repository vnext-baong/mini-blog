import { Expose } from 'class-transformer';
import { PaginationResponse } from 'src/common/types/pagination';

export class TopicResponse {
  @Expose()
  id: string;
  @Expose()
  name: string;
  @Expose()
  slug: string;
}

export class TopicListResponse extends PaginationResponse<TopicResponse> {}
