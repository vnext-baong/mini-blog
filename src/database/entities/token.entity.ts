import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tokens')
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'text' })
  refreshToken: string;
  @Column({ type: 'text' })
  refreshPublicKey: string;
  @Column({ type: 'text' })
  accessPublicKey: string;
  @Column()
  expiresAt: Date;
  @Column()
  userId: string;
  @Column()
  createdAt: Date;
  @Column({ default: null })
  updatedAt: Date;
  @Column({ default: null })
  deletedAt: Date;
}
