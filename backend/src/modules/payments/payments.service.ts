import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PaymentMethod } from "src/entities/payment-method.entity";
import { Repository } from "typeorm";

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentMethod) private repo: Repository<PaymentMethod>,
  ) {}

  async create(data: Partial<PaymentMethod>): Promise<PaymentMethod> {
    const method = this.repo.create(data);
    return this.repo.save(method);
  }

  async update(
    id: number,
    data: Partial<PaymentMethod>,
  ): Promise<PaymentMethod> {
    const existing = await this.repo.findOneBy({ id });
    if (!existing) throw new NotFoundException("Payment method not found");
    Object.assign(existing, data);
    return this.repo.save(existing);
  }

  async findAll(): Promise<PaymentMethod[]> {
    return this.repo.find({});
  }
}
