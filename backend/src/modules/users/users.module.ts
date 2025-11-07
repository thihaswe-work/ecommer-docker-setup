import { AuthMiddleware } from '@/common/auth.middleware';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Protect product routes (POST + PUT)
    consumer.apply(AuthMiddleware).forRoutes(UsersController);
  }
}
