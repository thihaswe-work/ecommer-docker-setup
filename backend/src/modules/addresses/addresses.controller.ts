import { AuthGuard } from '@/common/auth.guard';
import { Role } from '@/common/enum';
import { Roles } from '@/common/roles.decorator';
import { RolesGuard } from '@/common/roles.guard';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { Address } from 'src/entities/address.entity';
import { AddressesService } from './addresses.service';

@Controller('addresses')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.Admin)
export class AddressesController {
  constructor(private readonly addressService: AddressesService) {}

  @Get()
  findAll() {
    return this.addressService.findAll();
  }

  @Post()
  create(@Req() req: Request, @Body() body: Partial<Address>) {
    return this.addressService.create(body);
  }

  @Put()
  update(
    @Param() id: number,
    @Body() body: Partial<Address>,
  ) {
    return this.addressService.update(id, body);
  }
}
