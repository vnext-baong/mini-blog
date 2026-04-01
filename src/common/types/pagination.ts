import { IsOptional, Min } from 'class-validator';

export class Pagination {
  @IsOptional()
  @Min(1)
  page: number = 1;
  @IsOptional()
  @Min(1)
  limit: number = 10;
}

export class PaginationResponse<T> {
  items: T[];
  total: number;
  constructor(items: T[], total: number) {
    this.items = items;
    this.total = total;
  }
}
