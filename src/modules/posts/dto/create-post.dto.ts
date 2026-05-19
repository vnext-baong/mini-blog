import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'title' })
  title: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'content' })
  content: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'authorId' })
  authorId: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({ example: 'abc-123', required: false })
  topicId?: string;

  @IsOptional()
  @ApiProperty({
    example: 'thumbnail',
    type: 'string',
    format: 'binary',
    required: false,
  })
  thumbnail?: string;
}
