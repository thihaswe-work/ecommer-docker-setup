import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from 'src/entities/address.entity';
import { Order } from 'src/entities/order.entity';
import { PaymentMethod } from 'src/entities/payment-method.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MeService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Address) private addressRepo: Repository<Address>,
    @InjectRepository(PaymentMethod)
    private paymentMethodRepo: Repository<PaymentMethod>,
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
  ) {}

  async adminProfile(userId: string) {
    const data = await this.userRepo.findOneBy({ id: userId });

    return data;
  }

  async profile(userId: string) {
    try {
      const addresses = await this.addressRepo.find({
        where: { user: { id: userId } }, // <-- relation query
      });
      const paymentMethods = await this.paymentMethodRepo.find({
        where: { user: { id: userId } },
      });
      const orders = await this.orderRepo.find({
        where: { customerId: userId },
        relations: {
          orderItems: true,
          shippingAddress: true,
          contact: true,
        },
      });

      return { addresses, paymentMethods, orders };
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw new InternalServerErrorException('Failed to fetch user profile');
    }
  }

  async updateUserInfo(userId: string, data: Partial<User>) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    Object.assign(user, data);
    return await this.userRepo.save(user);
  }

  async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // check current password
    if (user.password !== currentPassword) {
      throw new BadRequestException('Current password is incorrect');
    }

    // update password
    user.password = newPassword;
    return await this.userRepo.save(user);
  }

  async createAddress(userId: string, data: Partial<Address>) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    const pervaddresses = await this.addressRepo.find({
      where: { user: { id: userId } },
    });

    const address = this.addressRepo.create({ ...data, user });
    if (data.isDefault === true) {
      for (const addr of pervaddresses) {
        if (addr.isDefault) {
          await this.addressRepo.update(addr.id, { isDefault: false });
        }
      }
    }
    return await this.addressRepo.save(address);
  }

  async updateAddress(
    userId: string,
    addressId: number,
    data: Partial<Address>,
  ) {
    const address = await this.addressRepo.findOne({
      where: { id: addressId },
      relations: ['user'],
    });
    if (!address) throw new NotFoundException('Address not found');
    if (address.user.id !== userId) throw new ForbiddenException();
    const pervaddresses = await this.addressRepo.find({
      where: { user: { id: userId } },
    });
    Object.assign(address, data);
    if (data.isDefault === true) {
      for (const addr of pervaddresses) {
        if (addr.isDefault) {
          await this.addressRepo.update(addr.id, { isDefault: false });
        }
      }
    }
    return await this.addressRepo.save(address);
  }

  async deleteAddress(userId: string, addressId: number) {
    const address = await this.addressRepo.findOne({
      where: { id: addressId },
      relations: ['user'],
    });
    if (!address) throw new NotFoundException('Address not found');
    if (address.user.id !== userId) throw new ForbiddenException();

    await this.addressRepo.remove(address);
    return { deleted: true };
  }

  async createPaymentMethod(userId: string, data: Partial<PaymentMethod>) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const pm = this.paymentMethodRepo.create({ ...data, user });
    return await this.paymentMethodRepo.save(pm);
  }

  async updatePaymentMethod(
    userId: string,
    paymentMethodId: number,
    data: Partial<PaymentMethod>,
  ) {
    const pm = await this.paymentMethodRepo.findOne({
      where: { id: paymentMethodId },
      relations: ['user'],
    });
    if (!pm) throw new NotFoundException('Payment method not found');
    if (pm.user.id !== userId) throw new ForbiddenException();

    Object.assign(pm, data);
    return await this.paymentMethodRepo.save(pm);
  }

  async deletePaymentMethod(userId: string, paymentMethodId: number) {
    const pm = await this.paymentMethodRepo.findOne({
      where: { id: paymentMethodId },
      relations: ['user'],
    });
    if (!pm) throw new NotFoundException('Payment method not found');
    if (pm.user.id !== userId) throw new ForbiddenException();

    await this.paymentMethodRepo.remove(pm);
    return { deleted: true };
  }
}
