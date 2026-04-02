import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

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
}
