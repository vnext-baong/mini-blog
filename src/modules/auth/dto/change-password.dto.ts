import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'currentPassword' })
  currentPassword: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'newPassword' })
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'userId' })
  userId: string;
}
