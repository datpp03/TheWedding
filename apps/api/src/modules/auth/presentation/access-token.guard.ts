import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../../common/decorators/public.decorator';
import type { RequestWithUser } from '../../../common/types/express-request';
import { ACCESS_TOKEN_COOKIE, CSRF_TOKEN_COOKIE } from '../application/auth.service';
import { AuthTokenService } from '../application/auth-token.service';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: AuthTokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = readAccessToken(request);
    request.user = await this.tokenService.verifyAccessToken(token);
    validateCsrf(request);

    return true;
  }
}

function readAccessToken(request: RequestWithUser) {
  const header = request.headers.authorization;

  if (header?.startsWith('Bearer ')) {
    return header.slice('Bearer '.length);
  }

  const cookies = request.cookies as Record<string, string | undefined> | undefined;
  return cookies?.[ACCESS_TOKEN_COOKIE] ?? '';
}

function validateCsrf(request: RequestWithUser) {
  if (SAFE_METHODS.has(request.method)) {
    return;
  }

  const cookies = request.cookies as Record<string, string | undefined> | undefined;
  const csrfHeader = readHeader(request.headers['x-csrf-token']);
  const csrfCookie = cookies?.[CSRF_TOKEN_COOKIE];

  if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
    throw new ForbiddenException('Invalid CSRF token');
  }
}

function readHeader(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
