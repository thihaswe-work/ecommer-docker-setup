import { AuthMiddleware } from '@/common/auth.middleware';
import { OwnershipGuardFactory } from '@/common/ownership.guard';
import { User } from '@/entities/user.entity';
import * as common from '@nestjs/common';
import { AddressModule } from '../addresses/addresses.module';
import { OrdersModule } from '../orders/orders.module';
import { PaymentMethodModule } from '../paymentMethod/paymentMethod.module';
import { UsersModule } from '../users/users.module';
import { MeController } from './me.controller';
import { MeService } from './me.service';

@common.Module({
  imports: [AddressModule, OrdersModule, UsersModule, PaymentMethodModule],
  controllers: [MeController],
  providers: [MeService, OwnershipGuardFactory(User)],
})
export class MeModule implements common.NestModule {
  configure(consumer: common.MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(MeController);
  }
}
