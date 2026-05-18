import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'username' })
  username: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'password' })
  password: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Bao NG' })
  name: string;
  @ApiProperty()
  @IsEmail()
  @MinLength(5)
  @MaxLength(50)
  email: string;
}
