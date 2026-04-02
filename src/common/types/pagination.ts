import { IsOptional, Min } from 'class-validator';

export class Pagination {
  @IsOptional()
  page: number = 1;
  @IsOptional()
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
