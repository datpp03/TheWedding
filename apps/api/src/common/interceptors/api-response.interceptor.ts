import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { RequestWithUser } from '../types/express-request';

type PossiblyWrappedResponse<T> =
  | T
  | {
      success: boolean;
      data?: T;
    };

@Injectable()
export class ApiResponseInterceptor<T> implements NestInterceptor<T, unknown> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<unknown> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    return next.handle().pipe(
      map((data: PossiblyWrappedResponse<T>) => {
        if (isWrappedResponse(data)) {
          return data;
        }

        return {
          success: true,
          data,
          message: 'OK',
          meta: request.correlationId ? { requestId: request.correlationId } : {},
        };
      }),
    );
  }
}

function isWrappedResponse(value: unknown): value is { success: boolean } {
  return Boolean(value && typeof value === 'object' && 'success' in value);
}
