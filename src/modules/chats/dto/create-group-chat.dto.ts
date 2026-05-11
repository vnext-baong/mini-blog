import { IsNotEmpty, ArrayMaxSize } from 'class-validator';
import { GroupType } from 'src/common/constants/enum';

export class CreateGroupChatDto {
  @IsNotEmpty()
  readonly name: string;
  @IsNotEmpty()
  readonly type: GroupType;
  @IsNotEmpty()
  @ArrayMaxSize(20, {
    message: 'A group chat can have a maximum of 20 members',
  })
  readonly memberIds: string[];
  @IsNotEmpty()
  readonly senderId: string;
}
