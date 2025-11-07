import { Body, Controller, Get, Param, Post, Put, Req } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";
import { PaymentsService } from "./payments.service";
import { MeMiddleware } from "src/modules/me/me.middleware";
import { PaymentMethod } from "src/entities/payment-method.entity";

@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  private useAuth(req: Request, res: Response, next: NextFunction) {
    new MeMiddleware().use(req, res, next);
  }

  @Get()
  FindAll(@Req() req: Request) {
    return this.paymentsService.findAll();
  }

  @Post()
  create(@Req() req: Request, @Body() body: Partial<PaymentMethod>) {
    return new Promise((resolve) => {
      this.useAuth(req, req.res, () => {
        resolve(this.paymentsService.create(body));
      });
    });
  }

  @Put(":id")
  update(
    @Req() req: Request,
    @Param("id") id: number,
    @Body() body: Partial<PaymentMethod>,
  ) {
    return new Promise((resolve, reject) => {
      this.useAuth(req, req.res, () => {
        const updated = this.paymentsService.update(id, body);
        if (!updated)
          reject({ status: 404, message: "Payment method not found" });
        resolve(updated);
      });
    });
  }
}
