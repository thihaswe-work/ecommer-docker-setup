// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import { getToken } from './lib';

// @Injectable()
// export class AuthMiddleware implements NestMiddleware {
//   use(req: Request, res: Response, next: NextFunction) {
//     // const bearer = req.headers['authorization'];

//     console.log(req);

//     const bearer = req.headers['cookie'];
//     const divideAdminAndUser = bearer.split('; ');

//     const isAdmin = bearer.split('=')[0] === 'adminToken';

//     // const authHeader = bearer?.split(' ')[1] || getToken(req.headers.cookie);
//     const authHeader = isAdmin
//       ? bearer.split('=')[1]
//       : getToken(req.headers.cookie);
//     if (!authHeader) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }
//     req.authToken = authHeader; // ✅ store safely
//     next();
//   }
// }
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { getToken } from './lib';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const cookieHeader = req.headers['cookie']; // may be undefined
    let authToken: string | undefined;

    const origin = req.headers['origin'] || req.headers['referer'];

    if (cookieHeader) {
      // Parse cookies into key/value pairs
      const cookies = Object.fromEntries(
        cookieHeader.split('; ').map((c) => {
          const [key, value] = c.split('=');
          return [key, value];
        }),
      );

      // Decide which token to pick based on origin
      if (origin?.includes(process.env.ADMIN_URL)) {
        // requests coming from admin frontend
        authToken = cookies['adminToken'];
      } else {
        // requests from normal frontend
        authToken = cookies['token'];
      }
    }

    // Fallback to getToken function if no token found
    // ----------- No need this code ------------
    if (!authToken) {
      authToken = getToken(cookieHeader);
    }

    if (!authToken) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.authToken = authToken; // store safely
    next();
  }
}
