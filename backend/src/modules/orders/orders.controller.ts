import { AuthGuard } from '@/common/auth.guard';
import { RolesGuard } from '@/common/roles.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { OrdersService } from './orders.service';
import { OwnershipGuardFactory } from '@/common/ownership.guard';
import { Order } from '@/entities/order.entity';
import { Roles } from '@/common/roles.decorator';
import { Role } from '@/common/enum';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  getAll(@Req() req: Request) {
    return this.ordersService.findAll();
  }
  @Get(':id')
  @UseGuards(AuthGuard, OwnershipGuardFactory(Order))
  getById(@Param('id') id: string) {
    return this.ordersService.findById(id);
  }

  @Post()
  create(@Req() req: Request, @Body() body: any) {
    // return this.ordersService.findById('44dac909-6de8-40ba-b2be-07395233d852');

    return this.ordersService.create(body);
  }

  @Put(':id')
  @UseGuards(AuthGuard, OwnershipGuardFactory(Order))
  update(@Req() req: Request, @Param('id') id: string, @Body() body: any) {
    const updated = this.ordersService.update(id, body);
    return updated;
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  delete(@Req() req: Request, @Param('id') id: string) {
    const updated = this.ordersService.delete(id);
    return updated;
  }
}
