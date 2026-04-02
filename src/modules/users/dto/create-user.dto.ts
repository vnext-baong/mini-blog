import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty({ example: 'username' })
  username: string;
  @IsString()
  @ApiProperty({ example: 'name' })
  name: string;
  @IsString()
  @ApiProperty({ example: 'password' })
  password: string;
}
