import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @ApiProperty({ example: 'title' })
  title: string;
  @IsString()
  @ApiProperty({ example: 'content' })
  content: string;
  @IsString()
  @ApiProperty({ example: 'authorId' })
  authorId: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({ example: 'abc-123', required: false })
  topicId?: string;
}
