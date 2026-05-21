import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('maintenanceIp')
export class MaintenanceIp {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  ip: string;
  @Column({ nullable: true })
  description?: string;
}
