import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConsoleLogger,
  ExceptionFilter,
  HttpException,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { DomainError } from '../../domain/DomainError';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new ConsoleLogger(AllExceptionsFilter.name);
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  private readonly FrameworkErrorClasses = [
    BadRequestException,
    UnauthorizedException,
    RequestTimeoutException,
    NotFoundException,
  ];

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    let message: string | null = null;
    let httpStatus: number | null = null;

    for (const Cls of this.FrameworkErrorClasses) {
      if (exception instanceof Cls) {
        const response = (exception as HttpException).getResponse() as { message?: string | string[] } | string;
        message =
          typeof response === 'string'
            ? response
            : Array.isArray(response.message)
              ? response.message.join(', ')
              : (response.message ?? exception.message);
        httpStatus = (exception as HttpException).getStatus();
        break;
      }
    }

    if (!message && exception instanceof DomainError) {
      message = exception.message;
      httpStatus = 400;
    }

    if (!message) {
      this.logger.error(`AllExceptionsFilter: ${String(exception)}`, (exception as Error)?.stack);
      message = 'Internal Server Error';
      httpStatus = 500;
    }

    httpAdapter.reply(ctx.getResponse(), { success: false, message }, httpStatus ?? 500);
  }
}
