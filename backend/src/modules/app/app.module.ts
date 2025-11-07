import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from 'src/data-source';
import { SeederModule } from 'src/seeder/seeder.module';
import { AddressModule } from '../addresses/addresses.module';
import { AuthModule } from '../auth/auth.module';
import { MeModule } from '../me/me.module';
import { OrdersModule } from '../orders/orders.module';
import { PaymentsModule } from '../payments/payments.module';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from '../categories/categories.module';
import { SettingModule } from '../settings/settings.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    UsersModule,
    OrdersModule,
    ProductsModule,
    AuthModule,
    MeModule,
    PaymentsModule,
    AddressModule,
    CategoriesModule,
    SettingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
