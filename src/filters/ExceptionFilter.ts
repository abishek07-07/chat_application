import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggingService } from '../utils/logging/logger.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggingService) {}

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const error = exception.getResponse();

    const logContext = {
      status,
      method: request.method,
      path: request.originalUrl,
      ip: request.ip,
      userAgent: request.headers['user-agent'],
      userId: (request as any).user?.id,
      params: request.params,
      query: request.query,
      body: this.sanitizeBody(request.body),
      timestamp: new Date().toISOString(),
    };

    switch (status) {
      case HttpStatus.BAD_REQUEST:
        this.logger.warn('Bad Request', {
          ...logContext,
          error,
        });
        break;

      case HttpStatus.UNAUTHORIZED:
        this.logger.warn('Unauthorized', {
          ...logContext,
          error,
        });
        break;

      case HttpStatus.FORBIDDEN:
        this.logger.warn('Forbidden', {
          ...logContext,
          error,
        });
        break;

      case HttpStatus.NOT_FOUND:
        this.logger.warn('Not Found', {
          ...logContext,
          error,
        });
        break;

      case HttpStatus.METHOD_NOT_ALLOWED:
        this.logger.warn('Method Not Allowed', {
          ...logContext,
          error,
        });
        break;

      case HttpStatus.CONFLICT:
        this.logger.warn('Conflict', {
          ...logContext,
          error,
        });
        break;

      case HttpStatus.UNPROCESSABLE_ENTITY:
        this.logger.warn('Unprocessable Entity', {
          ...logContext,
          error,
        });
        break;

      case HttpStatus.TOO_MANY_REQUESTS:
        this.logger.warn('Too Many Requests', {
          ...logContext,
          error,
        });
        break;

      default:
        this.logger.error(exception.message, {
          ...logContext,
          error,
          stack: exception.stack,
        });
    }

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      error:
        typeof error === 'string'
          ? error
          : ((error as { error?: string }).error ?? exception.name),
      timestamp: new Date().toISOString(),
      path: request.originalUrl,
    });
  }

  private sanitizeBody(body: unknown): unknown {
    if (!body || typeof body !== 'object') {
      return body;
    }

    const clone = { ...(body as Record<string, unknown>) };

    const sensitiveFields = [
      'password',
      'confirmPassword',
      'oldPassword',
      'newPassword',
      'token',
      'accessToken',
      'refreshToken',
      'authorization',
      'secret',
      'apiKey',
    ];

    for (const field of sensitiveFields) {
      if (field in clone) {
        clone[field] = '******';
      }
    }

    return clone;
  }
}
