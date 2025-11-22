import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('inventories')
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  price: number;

  @Column()
  stock: number;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}
