import * as jwt from 'jsonwebtoken';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/entities/user.entity';
import { Role } from '@/common/enum';

@Injectable()
export class AuthService {
  @InjectRepository(User) private repo: Repository<User>;

  async islogin(
    token?: string,
  ): Promise<{ user: User; newToken?: string } | null> {
    // In real app, verify JWT. For now, we just check the token string
    if (!token) throw new UnauthorizedException('Unauthorized');

    let payload: any;
    let newToken: string | undefined;

    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        payload = jwt.decode(token);

        if (!payload || typeof payload === 'string') {
          throw new UnauthorizedException('Unauthorized');
        }

        newToken = jwt.sign(
          { id: payload.id, email: payload.email, role: payload.role },
          process.env.JWT_USER_SECRET,
          { expiresIn: '7d' },
        );
      } else {
        throw new UnauthorizedException('Unauthorized');
      }
    }
    // Return a sample user, you can fetch actual user if you store userId in JWT
    const user = await this.repo.findOneBy({ email: payload.email }); // example

    if (!user) {
      throw new UnauthorizedException('Not logged in');
    }

    return { user, newToken };
  }

  async login(
    email: string,
    password: string,
    remember: boolean,
  ): Promise<{ user: User; token: string }> {
    const user = await this.repo.findOneBy({ email });

    if (!user) throw new Error('Email is Incorrect');
    if (user.password !== password) {
      throw new UnauthorizedException('Wrong Credentials');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'roleSecret',
      { expiresIn: remember ? '30d' : '1d' },
    );
    return { user, token };
  }

  async register(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) {
    // Check if user already exists
    const existingUser = await this.repo.findOneBy({
      email,
    });

    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const newUser = this.repo.create({
      firstName,
      lastName,
      email,
      password: password,
      role: Role.User, // default role
    });

    const user = await this.repo.save(newUser);
    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' },
    );

    return { user, token };
  }

  logout(): { message: string } {
    return { message: 'Logged out successfully' };
  }
}
