export type ApiSuccessResponse<TData, TMeta = Record<string, unknown>> = {
  success: true;
  data: TData;
  message: string;
  meta: TMeta;
};

export type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown[];
  };
};

export type ApiResponse<TData, TMeta = Record<string, unknown>> =
  | ApiSuccessResponse<TData, TMeta>
  | ApiErrorResponse;

export function ok<TData, TMeta = Record<string, unknown>>(
  data: TData,
  message = 'OK',
  meta = {} as TMeta,
): ApiSuccessResponse<TData, TMeta> {
  return {
    success: true,
    data,
    message,
    meta,
  };
}
