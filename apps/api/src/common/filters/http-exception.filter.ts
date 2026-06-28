import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import type { RequestWithUser } from '../types/express-request';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest<RequestWithUser>();
    const response = context.getResponse<Response>();
    const isHttpException = exception instanceof HttpException;
    const status = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const requestId = request.correlationId;

    if (!isHttpException) {
      this.logger.error(
        `Unhandled request error${requestId ? ` requestId=${requestId}` : ''} ${request.method} ${request.originalUrl}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(status).json({
      success: false,
      error: {
        code: isHttpException ? exception.name : 'INTERNAL_SERVER_ERROR',
        message: isHttpException ? exception.message : 'Internal server error',
        details: [],
      },
      meta: requestId ? { requestId } : {},
    });
  }
}
