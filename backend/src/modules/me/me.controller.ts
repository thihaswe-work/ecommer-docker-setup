import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Req,
  Res,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { MeService } from './me.service';
import { AuthGuard } from '@/common/auth.guard';
import { OwnershipGuardFactory } from '@/common/ownership.guard';
import { User } from '@/entities/user.entity';
import { Address } from '@/entities/address.entity';
import { PaymentMethod } from '@/entities/payment-method.entity';
import { Order } from '@/entities/order.entity';
import { RolesGuard } from '@/common/roles.guard';
import { Roles } from '@/common/roles.decorator';
import { Role } from '@/common/enum';

@Controller('me')
export class MeController {
  constructor(private readonly meService: MeService) {}

  // -------- PROFILE --------
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('adminProfile')
  async adminProfile(@Req() req: any) {
    const { user } = req;
    const data = await this.meService.adminProfile(user.id);
    return data;
  }

  @Get()
  @UseGuards(AuthGuard, OwnershipGuardFactory(User))
  async profile(@Req() req: any, @Res() res: Response) {
    const { user } = req;
    const data = await this.meService.profile(user.id);
    return res.status(200).json(data);
  }

  @Put()
  @UseGuards(AuthGuard, OwnershipGuardFactory(User))
  async updateProfile(
    @Req() req: any,
    @Body() dto: Partial<User>,
    @Res() res: Response,
  ) {
    const { user } = req;
    const data = await this.meService.updateUserInfo(user.id, dto);
    return res.status(200).json(data);
  }

  @Put('password')
  @UseGuards(AuthGuard, OwnershipGuardFactory(User))
  async updatePassword(
    @Req() req: any,
    @Body() dto: { currentPassword: string; newPassword: string },
    @Res() res: Response,
  ) {
    const updatedUser = await this.meService.updatePassword(
      req.user.id,
      dto.currentPassword,
      dto.newPassword,
    );
    return res.json(updatedUser);
  }

  // -------- ORDERS --------
  @Get('orders')
  @UseGuards(AuthGuard, OwnershipGuardFactory(Order))
  async getOrders(@Req() req: any, @Res() res: Response) {
    const { user } = req;
    const data = await this.meService.profile(user.id); // already includes orders
    return res.status(200).json(data.orders);
  }

  // -------- ADDRESSES --------
  @Post('addresses')
  @UseGuards(AuthGuard)
  async createAddress(
    @Req() req: any,
    @Body() dto: Partial<Address>,
    @Res() res: Response,
  ) {
    const { user } = req;
    console.log('data', dto);
    const address = await this.meService.createAddress(user.id, dto);
    return res.status(201).json(address);
  }

  @Put('addresses/:id')
  @UseGuards(AuthGuard, OwnershipGuardFactory(Address))
  async updateAddress(
    @Req() req: any,
    @Param('id') id: number,
    @Body() dto: Partial<Address>,
    @Res() res: Response,
  ) {
    const { user } = req;
    const address = await this.meService.updateAddress(user.id, +id, dto);
    return res.status(200).json(address);
  }

  @Delete('addresses/:id')
  @UseGuards(AuthGuard, OwnershipGuardFactory(Address))
  async deleteAddress(
    @Req() req: any,
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    const { user } = req;
    const result = await this.meService.deleteAddress(user.id, +id);
    return res.status(200).json(result);
  }

  // -------- PAYMENT METHODS --------
  @Post('payment-methods')
  @UseGuards(AuthGuard)
  async createPaymentMethod(
    @Req() req: any,
    @Body() dto: Partial<PaymentMethod>,
    @Res() res: Response,
  ) {
    const { user } = req;
    const pm = await this.meService.createPaymentMethod(user.id, dto);
    return res.status(201).json(pm);
  }

  @Put('payment-methods/:id')
  @UseGuards(AuthGuard, OwnershipGuardFactory(PaymentMethod))
  async updatePaymentMethod(
    @Req() req: any,
    @Param('id') id: number,
    @Body() dto: Partial<PaymentMethod>,
    @Res() res: Response,
  ) {
    const { user } = req;
    const pm = await this.meService.updatePaymentMethod(user.id, +id, dto);
    return res.status(200).json(pm);
  }

  @Delete('payment-methods/:id')
  @UseGuards(AuthGuard, OwnershipGuardFactory(PaymentMethod))
  async deletePaymentMethod(
    @Req() req: any,
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    const { user } = req;
    const result = await this.meService.deletePaymentMethod(user.id, +id);
    return res.status(200).json(result);
  }
}
