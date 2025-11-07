import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { getToken } from 'src/common/lib';

@Injectable()
export class MeMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.cookie;
    if (!authHeader) throw new UnauthorizedException('No token provided');

    let token;
    if (authHeader) {
      const rawCookie = req.headers.cookie;
      token = getToken(rawCookie);
    }

    if (!token) throw new UnauthorizedException('Unauthorized');

    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_USER_SECRET!);
        (req as any).user = payload;
        next();
      } catch (err: any) {
        if (err.name === 'TokenExpiredError') {
          // return a specific response so frontend knows what to do
          return res.status(401).json({
            error: 'TokenExpired',
            message: 'Your session has expired. Please call /me to refresh.',
          });
        }
        throw new UnauthorizedException('Invalid token');
      }
    }
  }
}
