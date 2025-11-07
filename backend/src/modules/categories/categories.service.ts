import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from 'typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly repo: Repository<Category>,
  ) {}

  async create(data: Partial<Category>): Promise<Category> {
    const Category = this.repo.create(data);
    return this.repo.save(Category);
  }

  async update(id: number, data: Partial<Category>): Promise<Category> {
    const existing = await this.repo.findOneBy({ id });
    if (!existing) throw new NotFoundException('Category not found');
    Object.assign(existing, data);
    return this.repo.save(existing);
  }
  async delete(id: number) {
    const existing = await this.repo.findOneBy({ id });
    if (!existing) {
      throw new NotFoundException('Category not found');
    }
    return this.repo.delete(id);
  }

  async findAll() {
    return await this.repo.find();
  }

  async findOne(id: number): Promise<Category> {
    return await this.repo.findOne({
      where: { id },
      relations: ['inventory'], // make sure inventory is loaded
    });
  }
}
