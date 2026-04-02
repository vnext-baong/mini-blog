import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

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
}
