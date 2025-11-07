import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { SettingController } from './settings.controller';
import { SettingService } from './settings.service';
import { Setting } from '@/entities/setting.entity';
import { AuthMiddleware } from '@/common/auth.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Setting])],
  controllers: [SettingController],
  providers: [SettingService],
})
export class SettingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Protect product routes (POST + PUT)
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'settings', method: RequestMethod.PUT });
    // consumer.apply(AuthMiddleware).forRoutes(ProductsController);
  }
}
