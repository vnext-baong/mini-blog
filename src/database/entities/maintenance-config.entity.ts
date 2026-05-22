import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('maintenanceconfig')
export class MaintenanceConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  isActive: boolean;
}
