import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('maintenanceConfig')
export class MaintenanceConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  isActive: boolean;
}