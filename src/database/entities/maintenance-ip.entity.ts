import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('maintenanceip')
export class MaintenanceIp {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  ip: string;
  @Column({ nullable: true })
  description?: string;
}
