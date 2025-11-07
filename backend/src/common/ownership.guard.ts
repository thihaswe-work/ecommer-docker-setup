// // src/guards/ownership.guard.ts
// import {
//   CanActivate,
//   ExecutionContext,
//   Injectable,
//   ForbiddenException,
// } from '@nestjs/common';
// import { OrdersService } from '../modules/orders/orders.service';
// import { Order } from '@/entities/order.entity';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';

// @Injectable()
// export class OwnershipGuard implements CanActivate {
//   constructor(
//     @InjectRepository(Order) private readonly repo: Repository<Order>,
//   ) {}
//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const user = request.user;
//     const orderId = request.params.id;

//     // Admin bypass
//     if (user.role === 'admin') return true;

//     // Check ownership for normal users
//     const order = await this.repo.findOneBy({ id: orderId });

//     if (!order) throw new ForbiddenException('Order not found');

//     if (order.customerId !== user.id)
//       throw new ForbiddenException('Not allowed');
//     return true;
//   }
// }

// src/guards/ownership.guard.ts
import { User } from '@/entities/user.entity';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  Type,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export const OwnershipGuardFactory = (entity: Type<any>) => {
  @Injectable()
  class GenericOwnershipGuard implements CanActivate {
    constructor(
      @InjectRepository(entity)
      public readonly repo: Repository<any>, // ✅ make public
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      const id = request.params.id;

      if (user.role === 'admin') return true;

      // authorization for me/ route only
      if (!id) {
        const record = this.repo.findBy({ id: user.id });

        if (record) return true;
      }

      // normal authorization for other entity
      const hasUserRelation = this.repo.metadata.relations.some(
        (rel) => rel.propertyName === 'user',
      );

      const record = await this.repo.findOne({
        where: { id },
        relations: hasUserRelation ? ['user'] : [],
      });

      if (!record) throw new ForbiddenException('Resource not found');

      let ownerId: string | undefined;

      // If the entity is User itself
      if (record instanceof User) {
        ownerId = record.id;
      }
      // If it has a 'user' relation
      else if ('user' in record && record.user?.id) {
        ownerId = record.user.id;
      }
      // Otherwise, check common ownership fields
      else {
        const ownerFields = ['userId', 'customerId', 'ownerId'];
        for (const field of ownerFields) {
          const value = record[field];
          if (typeof value === 'object' && value !== null && 'id' in value) {
            ownerId = value.id;
            break;
          } else if (typeof value === 'string') {
            ownerId = value;
            break;
          }
        }
      }

      if (!ownerId || ownerId !== user.id) {
        throw new ForbiddenException('Not allowed');
      }

      return true;
    }
  }

  return GenericOwnershipGuard;
};

// const record = await this.repo.findOne({ where: { id } });
// if (!record) throw new ForbiddenException('Resource not found');

// if (record instanceof User && record.id === user.id) return true;
// // check multiple possible ownership fields
// const ownerIds = ['userId', 'customerId', 'ownerId'];
// const isOwner = ownerIds.some((key) => record[key] === user.id);
