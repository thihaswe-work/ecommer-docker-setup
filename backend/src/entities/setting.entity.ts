import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('settings')
export class Setting {
  // Always use a fixed ID (like 1)
  @PrimaryColumn()
  id: number = 1;

  @Column({ default: false })
  underMaintenance: boolean;
}
