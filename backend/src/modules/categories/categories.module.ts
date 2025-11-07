import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from '../../common/auth.middleware';
import { Product } from '../../entities/product.entity';
import { CategoriesService } from './categories.service';
import { CatgoriesController } from './categories.controller';
import { Category } from '@/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CatgoriesController],
  providers: [
    CategoriesService,
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
})
export class CategoriesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Protect product routes (POST + PUT)
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'categories', method: RequestMethod.POST },
        { path: 'categories/:id', method: RequestMethod.PUT },
        { path: 'categories/:id', method: RequestMethod.DELETE },
      );
    // consumer.apply(AuthMiddleware).forRoutes(ProductsController);
  }
}
