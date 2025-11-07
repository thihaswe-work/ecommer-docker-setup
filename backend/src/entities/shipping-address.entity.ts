import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";

@Entity("shipping_addresses")
export class ShippingAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 1024 })
  address: string;

  @Column({ length: 255 })
  city: string;

  @Column({ length: 255 })
  state: string;

  @Column({ length: 255 })
  country: string;

  @Column({ length: 20 })
  postalCode: string;
}
