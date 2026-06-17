import type { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';

const CORRELATION_ID_HEADER = 'x-correlation-id';

export function requestCorrelationMiddleware(
  request: Request & { correlationId?: string },
  response: Response,
  next: NextFunction,
) {
  const incoming = readHeader(request.headers[CORRELATION_ID_HEADER]);
  const correlationId = incoming && isSafeCorrelationId(incoming) ? incoming : randomUUID();

  request.correlationId = correlationId;
  response.setHeader(CORRELATION_ID_HEADER, correlationId);
  next();
}

function readHeader(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function isSafeCorrelationId(value: string) {
  return /^[a-zA-Z0-9._:-]{8,128}$/.test(value);
}
