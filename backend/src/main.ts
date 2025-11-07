import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/modules/app/app.module';
import * as dotenv from 'dotenv';
import { GlobalExceptionFilter } from './filerAndInterceptors/http-exception.filter';
import { LoggingInterceptor } from './filerAndInterceptors/http-interceptor';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Apply global filter
  // app.useGlobalFilters(new GlobalExceptionFilter());

  // Apply global interceptors
  // app.useGlobalInterceptors(new LoggingInterceptor());

  app.enableCors({
    origin: [process.env.USER_URL, process.env.ADMIN_URL], // your frontend URL
    credentials: true, // allow cookies/auth headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
  await app.listen(port);

  console.log(
    `Server running at http://${process.env.DB_HOST || 'localhost'}:${port}`,
  );
}

bootstrap();
