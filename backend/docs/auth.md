## Auth Structure

This project demonstrates three different ways of handling authentication in a NestJS application:

1. AuthGuard – used for the orders routes (NestJS-native guard).

2. Middleware – used for the products routes (classic Express-style middleware).

3. Manual middleware + Promise – used for users routes to demonstrate manual control of async flow inside controllers.

### 1. AuthGuard (Orders Route)

- File: src/common/auth.guard.ts

```ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers['authorization'];
    const expected = `Bearer ${process.env.AUTH_TOKEN || 'mysecrettoken'}`;

    if (!authHeader || authHeader !== expected) {
      throw new UnauthorizedException('Unauthorized');
    }

    return true;
  }
}
```

- Usuage in Controllers

```ts
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @UseGuards(AuthGuard)
  getAll() {
    return this.ordersService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() body: any) {
    return this.ordersService.create(body);
  }
}
```

✅ Benefits:

- Controller code is clean, no manual Promise needed.

- Unauthorized requests automatically throw 401.

### 2. Middleware (Products Route)

- File: src/middleware/auth.middleware.ts

```ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const expected = `Bearer ${process.env.AUTH_TOKEN || 'mysecrettoken'}`;

    if (!authHeader || authHeader !== expected) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    next();
  }
}
```

- Applied in products.module.ts:

```ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

@Module({
  controllers: [ProductsController],
})
export class ProductsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(ProductsController);
  }
}
```

✅ Notes:

- Works globally or per-controller/module.

- No need for Promise inside controllers.

### 3. Manual Middleware + Promise (Users Route)

- Controller manually calls middleware and wraps in a Promise:

```ts
@Post()
createUser(@Req() req: Request, @Body() body: any) {
  return new Promise((resolve) => {
    new AuthMiddleware().use(req, req.res, () => {
      resolve(this.usersService.create(body));
    });
  });
}
```

- Why Promise is used:
  The controller waits until next() is called inside the middleware before executing the service call.

✅ Notes:

- Works for demonstration but not idiomatic NestJS.

- You must manually handle req, res, and next().

### 4. (Optional) Apply globally

- If you want this guard on every route (not just orders), register it in app.module.ts:

```ts import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [OrdersModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
```

Now, every request must include the correct token.

✅ So, you put your code in src/common/auth.guard.ts and then import it wherever you need (@UseGuards(AuthGuard)).</br>
so you don't have to use `@useGuards(authGuard)` everywhere.
