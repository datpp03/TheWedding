import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type PossiblyWrappedResponse<T> =
  | T
  | {
      success: boolean;
      data?: T;
    };

@Injectable()
export class ApiResponseInterceptor<T> implements NestInterceptor<T, unknown> {
  intercept(_context: ExecutionContext, next: CallHandler<T>): Observable<unknown> {
    return next.handle().pipe(
      map((data: PossiblyWrappedResponse<T>) => {
        if (isWrappedResponse(data)) {
          return data;
        }

        return {
          success: true,
          data,
          message: 'OK',
          meta: {},
        };
      }),
    );
  }
}

function isWrappedResponse(value: unknown): value is { success: boolean } {
  return Boolean(value && typeof value === 'object' && 'success' in value);
}
