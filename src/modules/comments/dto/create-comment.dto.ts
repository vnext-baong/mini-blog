import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'comment' })
  content: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'postId' })
  postId: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'authorId' })
  authorId: string;
}
