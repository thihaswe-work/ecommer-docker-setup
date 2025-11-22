import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('settings')
export class Setting {
  @PrimaryColumn()
  id: number = 1;

  @Column({ default: false })
  underMaintenance: boolean;
}
