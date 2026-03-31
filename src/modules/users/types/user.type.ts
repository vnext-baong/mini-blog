import { Expose } from 'class-transformer';
import { PaginationResponse } from 'src/common/types/pagination';

export class UserResponse {
  @Expose()
  id: string;
  @Expose()
  username: string;
  @Expose()
  name: string;
}

export class UserListResponse extends PaginationResponse<UserResponse> {}
