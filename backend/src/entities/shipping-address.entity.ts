import {
  Column,
  Entity,
  PrimaryGeneratedColumn
} from "typeorm";

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
