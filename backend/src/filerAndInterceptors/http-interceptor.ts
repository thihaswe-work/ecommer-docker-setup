import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable, tap, map } from "rxjs";
import { Request, Response } from "express";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();

    const { method, url, body, headers } = request;
    console.log(`\n➡ Incoming Request: ${method} ${url}`);
    console.log(`Headers:`, headers);
    console.log(`Body:`, body);

    // const now = Date.now();
    // return next.handle().pipe(
    //   map((data) => {
    //     console.log(`⬅ Response Status: ${response.statusCode}`);
    //     console.log(`Response Body:`, data);
    //     console.log(`Processing Time: ${Date.now() - now}ms\n`);
    //     return data; // return the original response
    //   }),
    // );
    const now = Date.now();
    return next.handle().pipe(
      tap((data) => {
        console.log(`⬅ Response Status: ${response.statusCode}`);
        console.log(`Response Body:`, data);
        console.log(`Processing Time: ${Date.now() - now}ms\n`);
      }),
    );
  }
}
