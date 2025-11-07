import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  number: string;

  @Column({ nullable: true })
  cardName: 'Visa' | 'Mastercard' | 'Amex';

  @Column({ nullable: true })
  holderName: string;

  @Column({ type: 'float' })
  amount: number;

  @Column()
  paymentType: 'card' | 'paypal' | 'onDelivery';
}
