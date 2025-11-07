import { Setting } from '@/entities/setting.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(Setting)
    private readonly repo: Repository<Setting>,
  ) {}

  async getMaintenanceStatus() {
    const setting = await this.repo.findOne({ where: { id: 1 } });
    return { underMaintenance: setting?.underMaintenance ?? false };
  }

  async updateMaintenanceStatus(underMaintenance: boolean) {
    let setting = await this.repo.findOne({ where: { id: 1 } });
    if (setting) {
      setting.underMaintenance = underMaintenance;
      return this.repo.save(setting);
    }

    // if not found, create one
    const newSetting = this.repo.create({ id: 1, underMaintenance });
    return this.repo.save(newSetting);
  }
}
