import { IsNotEmpty } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty()
  readonly content: string;
  @IsNotEmpty()
  readonly groupId: string;
}
