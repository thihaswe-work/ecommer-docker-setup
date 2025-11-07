import { Controller, Get, Post, Body, UseGuards, Put } from '@nestjs/common';
import { SettingService } from './settings.service';
import { Role } from '@/common/enum';
import { AuthGuard } from '@/common/auth.guard';
import { Roles } from '@/common/roles.decorator';
import { RolesGuard } from '@/common/roles.guard';

@Controller('settings')
export class SettingController {
  constructor(private readonly settingsService: SettingService) {}

  @Get()
  async getMaintenanceStatus() {
    return this.settingsService.getMaintenanceStatus();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Put()
  async setMaintenanceStatus(@Body() body: { underMaintenance: boolean }) {
    return this.settingsService.updateMaintenanceStatus(body.underMaintenance);
  }
}
