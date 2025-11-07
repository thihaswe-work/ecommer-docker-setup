import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Address } from '../../entities/address.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AddressesService {
  constructor(@InjectRepository(Address) private repo: Repository<Address>) {}

  async create(data: Partial<Address>): Promise<Address> {
    const method = this.repo.create(data);
    return this.repo.save(method);
  }
  async update(id: number, data: Partial<Address>): Promise<Address> {
    const existing = await this.repo.findOneBy({ id });
    if (!existing) throw new NotFoundException('Payment method not found');
    Object.assign(existing, data);
    return this.repo.save(existing);
  }

  async findAll(): Promise<Address[]> {
    return this.repo.find({});
  }
}
