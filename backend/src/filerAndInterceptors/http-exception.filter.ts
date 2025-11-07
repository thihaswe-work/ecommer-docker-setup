import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch() // catch all exceptions
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Default values
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";
    let messageCode = 1; // Custom Added to the exception filer

    // Handle HttpException separately
    if (exception instanceof HttpException) {
      console.log("exception instance", exception);
      status = exception.getStatus();
      messageCode = 40; // Custom Added to the exception filer
      message = exception.getResponse() as any;
    }

    // Log error to console (optional)
    console.error("GlobalExceptionFilter:", exception);

    // Send structured JSON response
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      messageCode, // Custom Added to the exception filer
      message,
    });
  }
}
