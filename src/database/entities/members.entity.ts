import { UserRole } from '../../common/constants/enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('members')
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  groupId: string;
  @Column()
  userId: string;
  @Column()
  name: string;
  @Column()
  role: UserRole;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
