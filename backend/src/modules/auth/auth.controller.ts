import { Role } from '@/common/enum';
import { getToken } from '@/common/lib';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async islogin(@Req() req: Request, @Res() res: Response) {
    const rawCookie = req.headers.cookie;
    const token = getToken(rawCookie);

    const { user, newToken } = await this.authService.islogin(token);

    if (newToken) {
      res.cookie(user.role === Role.Admin ? 'adminToken' : 'token', token, {
        httpOnly: user.role === Role.User ? true : false,
        secure: true,
        sameSite: 'none',
        path: '/',
        maxAge: 24 * 60 * 60 * 1000,
      });
    }

    if (!user) {
      return new NotFoundException('User Not Found');
    }

    const { password: _, ...safeUser } = user;

    return res
      .status(HttpStatus.OK)
      .json({ message: 'Logged in', user: safeUser });

    // res.json('hello');
  }

  @Post('login')
  async login(
    @Body()
    body: { email: string; password: string; remember: boolean },
    @Res() res: Response,
  ) {
    try {
      const { email, password, remember } = body;
      const { user, token } = await this.authService.login(
        email,
        password,
        remember,
      );

      res.cookie(user.role === Role.Admin ? 'adminToken' : 'token', token, {
        httpOnly: user.role === Role.User ? true : false,
        secure: true,
        sameSite: 'none',
        path: '/',
        maxAge: body.remember ? 7 * 24 * 60 * 60 * 1000 : undefined,
      });
      const { password: _, ...safeUser } = user;
      return res.status(HttpStatus.OK).json({
        message: 'Logged in',
        user: safeUser,
      });
    } catch (err: any) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: err.message });
    }
  }

  @Post('register')
  async register(
    @Body()
    body: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    },
    @Res() res: Response,
  ) {
    try {
      const { firstName, lastName, email, password } = body;

      const { user, token } = await this.authService.register(
        firstName,
        lastName,
        email,
        password,
      );

      // ✅ Cookie lasts 7 days
      res.cookie(user.role === Role.Admin ? 'adminToken' : 'token', token, {
        httpOnly: user.role === Role.User ? true : false,
        secure: true,
        sameSite: 'none',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      const { password: _, ...safeUser } = user;

      return res.status(HttpStatus.CREATED).json({
        message: 'Registered successfully',
        user: safeUser,
      });
    } catch (err: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @Post('logout')
  logout(@Body() body, @Res() res: Response) {
    res.clearCookie(body.userRole === 'admin' ? 'adminToken' : 'token');
    return res.status(HttpStatus.OK).json(this.authService.logout());
  }
}
