import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { Category, Inventory } from '@/entities';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,

    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async create(
    data: Partial<Product> & { categoryId?: number },
  ): Promise<Product> {
    const product = this.repo.create({
      ...data,
      inventory: {
        price: 0,
        stock: 0,
      },
    });

    // If categoryId is provided in the data, find the category and assign it
    if (data.categoryId) {
      const category = await this.categoryRepo.findOneBy({
        id: data.categoryId,
      });
      if (!category) throw new NotFoundException('Category not found');
      product.category = category;
    }

    return this.repo.save(product);
  }

  async update(
    id: number,
    data: Partial<Product> & { categoryId?: number },
  ): Promise<Product> {
    const existing = await this.repo.findOne({
      where: { id },
      relations: ['category'], // Ensure the current category is loaded
    });

    if (!existing) throw new NotFoundException('Product not found');

    // If categoryId is provided in the data, find the category and assign it
    if (data.categoryId) {
      const category = await this.categoryRepo.findOneBy({
        id: data.categoryId,
      });
      if (!category) throw new NotFoundException('Category not found');
      existing.category = category;
    }

    // Update other fields of the product
    Object.assign(existing, data);

    // Save the updated product
    return this.repo.save(existing);
  }

  async delete(id: number) {
    const existing = await this.repo.findOneBy({ id });
    if (!existing) {
      throw new NotFoundException('Product not found');
    }
    return this.repo.delete(id);
  }

  async findAll(
    page: number,
    limit: number,
    order: 'ASC' | 'DESC',
    query?: string,
    min?: number,
    max?: number,
    categories?: number[] | undefined, //
  ) {
    const qb = this.repo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.inventory', 'inventory')
      .leftJoinAndSelect('product.category', 'category') // join category relation
      .orderBy('product.name', order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC')
      .take(limit)
      .skip((page - 1) * limit);
    // Only active products
    qb.andWhere('product.status = :status', { status: true });

    if (query) {
      qb.andWhere('product.name LIKE :query', { query: `%${query}%` });
    }

    if (min !== undefined) {
      qb.andWhere('inventory.price >= :min', { min });
    }

    if (max !== undefined) {
      qb.andWhere('inventory.price <= :max', { max });
    }
    if (categories && categories.length > 0) {
      qb.andWhere('category.id IN (:...categories)', { categories });
    }

    const [data, total] = await qb.getManyAndCount();
    // Remove status from the returned objects
    const cleanedData = data.map(({ status, ...rest }) => rest);
    return {
      data: cleanedData,
      meta: {
        totalItems: total,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  async findAdminAll() {
    return await this.repo.find({ relations: ['category'] });
  }

  async findOne(id: number): Promise<Product> {
    return await this.repo.findOne({
      where: { id },
      relations: ['inventory'], // make sure inventory is loaded
    });
  }
}
