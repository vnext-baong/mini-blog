import { IsNotEmpty, IsString } from 'class-validator';
import { Pagination } from 'src/common/types/pagination';

export class GetMessageDto extends Pagination {
  @IsNotEmpty()
  @IsString()
  groupId: string;
}
