import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('maintenanceuser')
export class MaintenanceUser {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  userId: string;
}
