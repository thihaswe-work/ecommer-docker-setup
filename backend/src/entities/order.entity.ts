import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { OrderItem } from "./orderItem.entity";
import { Address } from "src/entities/address.entity";
import { PaymentMethod } from "src/entities/payment-method.entity";
import { Contact } from "./contact.entity";
import { Payment } from "./payment.entity";
import { ShippingAddress } from "./shipping-address.entity";

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  customerId: string | null;

  @Column("float", { default: 0 })
  subtotal: number;

  @Column("float", { default: 0 })
  shipping: number;

  @Column("float", { default: 0 })
  total: number;

  @Column({ type: "varchar", length: 50, default: "pending" })
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";

  @CreateDateColumn({ type: "datetime" })
  createdAt: Date;

  @UpdateDateColumn({ type: "datetime" })
  updatedAt: Date;

  @OneToOne(() => Contact, { cascade: true })
  @JoinColumn()
  contact: Contact;

  @OneToOne(() => Payment, { cascade: true })
  @JoinColumn()
  payment: Payment;

  @ManyToOne(() => ShippingAddress, { cascade: true })
  @JoinColumn()
  shippingAddress: ShippingAddress;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  orderItems: OrderItem[];
}
