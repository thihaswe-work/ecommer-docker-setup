import { AuthMiddleware } from '@/common/auth.middleware';
import * as common from '@nestjs/common';
import { AddressModule } from '../addresses/addresses.module';
import { OrdersModule } from '../orders/orders.module';
import { UsersModule } from '../users/users.module';
import { MeController } from './me.controller';
import { MeService } from './me.service';
import { PaymentMethodModule } from '../paymentMethod/paymentMethod.module';
import { OwnershipGuardFactory } from '@/common/ownership.guard';
import { User } from '@/entities/user.entity';

@common.Module({
  imports: [AddressModule, OrdersModule, UsersModule, PaymentMethodModule],
  controllers: [MeController],
  providers: [MeService, OwnershipGuardFactory(User)],
})
export class MeModule implements common.NestModule {
  configure(consumer: common.MiddlewareConsumer) {
    // consumer
    //   .apply(AuthMiddleware)
    //   .forRoutes(
    //     { path: 'me', method: common.RequestMethod.PUT },
    //     { path: 'me', method: common.RequestMethod.DELETE },
    //     { path: 'me', method: common.RequestMethod.GET },
    //   ); // Only protect /users/me
    consumer.apply(AuthMiddleware).forRoutes(MeController);
  }
}
