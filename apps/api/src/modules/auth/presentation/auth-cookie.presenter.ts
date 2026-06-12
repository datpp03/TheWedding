import type { Response } from 'express';
import type { ConfigService } from '@nestjs/config';
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  type AuthService,
} from '../application/auth.service';

type AuthTokens = Awaited<ReturnType<AuthService['login']>>['tokens'];

export function setAuthCookies(response: Response, tokens: AuthTokens, config: ConfigService) {
  const secure = config.get<string>('NODE_ENV') === 'production';

  response.cookie(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
    httpOnly: true,
    maxAge: 15 * 60 * 1000,
    sameSite: 'lax',
    secure,
  });
  response.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: 'lax',
    secure,
  });
}

export function clearAuthCookies(response: Response, config: ConfigService) {
  const secure = config.get<string>('NODE_ENV') === 'production';
  response.clearCookie(ACCESS_TOKEN_COOKIE, { sameSite: 'lax', secure });
  response.clearCookie(REFRESH_TOKEN_COOKIE, { sameSite: 'lax', secure });
}
