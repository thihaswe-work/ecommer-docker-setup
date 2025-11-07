import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(data: Partial<User>): Promise<User> {
    const u = await this.repo.create(data);
    return this.repo.save(u);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.repo.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    Object.assign(user, data);
    return this.repo.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.repo.find();
  }

  async findById(id: string): Promise<User> {
    return this.repo.findOneBy({ id });
  }

  async delete(id: string) {
    const existing = await this.repo.findOneBy({ id });
    if (!existing) {
      throw new NotFoundException('Product not found');
    }
    return this.repo.delete(id);
  }
}
