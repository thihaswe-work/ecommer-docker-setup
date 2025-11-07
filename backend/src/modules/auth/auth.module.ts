import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Contact } from 'src/entities/contact.entity';
import { Order } from 'src/entities/order.entity';
import { OrderItem } from 'src/entities/orderItem.entity';
import { PaymentMethod } from 'src/entities/payment-method.entity';
import { Address } from '../../entities/address.entity';
import { User } from '../../entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from '../../common/auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Address,
      PaymentMethod,
      Order,
      OrderItem,
      Contact,
    ]),
  ],
  controllers: [AuthController], // ✅ AuthController goes here
  providers: [AuthService], // ✅ AuthService should be in providers
  // exports: [AuthGuard],
})
export class AuthModule {}
