import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaymentsService } from "./payments.service";
import { PaymentMethod } from "src/entities/payment-method.entity";
import { PaymentsController } from "./payments.controller";

@Module({
  imports: [TypeOrmModule.forFeature([PaymentMethod])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
