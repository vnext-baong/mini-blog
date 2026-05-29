import { IsNotEmpty } from 'class-validator';

export class TokenPayloadDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  email: string;
}
