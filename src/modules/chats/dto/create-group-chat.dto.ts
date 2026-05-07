import { IsNotEmpty } from 'class-validator';
import { GroupType } from 'src/common/constants/enum';

export class CreateGroupChatDto {
  @IsNotEmpty()
  readonly name: string;
  @IsNotEmpty()
  readonly type: GroupType;
  @IsNotEmpty()
  readonly memberIds: string[];
  @IsNotEmpty()
  readonly senderId: string;
}
