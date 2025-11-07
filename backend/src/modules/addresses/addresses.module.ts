import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from '../../entities/address.entity';
import { AddressesController } from './addresses.controller';
import { AddressesService } from './addresses.service';
import { MeMiddleware } from '../me/me.middleware';
import { AuthMiddleware } from '@/common/auth.middleware';
import { OwnershipGuardFactory } from '@/common/ownership.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Address])],
  controllers: [AddressesController],
  providers: [AddressesService, OwnershipGuardFactory(Address)],
  exports: [TypeOrmModule, AddressesService],
})
export class AddressModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('/addresses'); // Only protect /users/me
  }
}
