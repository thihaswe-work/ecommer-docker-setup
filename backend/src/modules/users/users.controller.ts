import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { User } from 'src/entities/user.entity';
import { UsersService } from './users.service';
import { AuthGuard } from '@/common/auth.guard';
import { RolesGuard } from '@/common/roles.guard';
import { Roles } from '@/common/roles.decorator';
import { Role } from '@/common/enum';

@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.Admin)
  async findAll(@Req() req: Request) {
    const users = await this.usersService.findAll();
    return users;
  }

  @Get(':id')
  async findById(@Req() req: Request, @Param('id') id: string) {
    const users = await this.usersService.findById(id);
    return users;
  }

  @Put(':id')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: Partial<User>,
  ) {
    const updated = await this.usersService.update(id, body);
    return updated;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deleted = await this.usersService.delete(id);
    if (!deleted) {
      return { status: 404, message: 'User not found' };
    } else {
      return { status: 200, message: 'User deleted successfully' };
    }
  }
}
