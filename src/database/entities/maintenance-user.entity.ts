import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('maintenanceUser')
export class MaintenanceUser {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  userId: string;
}
