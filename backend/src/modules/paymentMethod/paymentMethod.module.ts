import { PaymentMethod } from '@/entities/payment-method.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentMethod])],
  exports: [TypeOrmModule],
})
export class PaymentMethodModule {}
