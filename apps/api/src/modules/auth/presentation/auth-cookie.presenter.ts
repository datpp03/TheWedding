import type { Response } from 'express';
import type { ConfigService } from '@nestjs/config';
import {
  ACCESS_TOKEN_COOKIE,
  CSRF_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  type AuthService,
} from '../application/auth.service';

type AuthTokens = Awaited<ReturnType<AuthService['login']>>['tokens'];

export function setAuthCookies(response: Response, tokens: AuthTokens, config: ConfigService) {
  const secure = config.get<string>('NODE_ENV') === 'production';
  const domain = getCookieDomain(config);

  response.cookie(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
    domain,
    httpOnly: true,
    maxAge: 15 * 60 * 1000,
    path: '/',
    sameSite: 'lax',
    secure,
  });
  response.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
    domain,
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: '/',
    sameSite: 'lax',
    secure,
  });
}

export function clearAuthCookies(response: Response, config: ConfigService) {
  const secure = config.get<string>('NODE_ENV') === 'production';
  const domain = getCookieDomain(config);
  response.clearCookie(ACCESS_TOKEN_COOKIE, { domain, path: '/', sameSite: 'lax', secure });
  response.clearCookie(REFRESH_TOKEN_COOKIE, { domain, path: '/', sameSite: 'lax', secure });
}

export function setCsrfCookie(response: Response, token: string, config: ConfigService) {
  const secure = config.get<string>('NODE_ENV') === 'production';
  const domain = getCookieDomain(config);

  response.cookie(CSRF_TOKEN_COOKIE, token, {
    domain,
    httpOnly: false,
    maxAge: 24 * 60 * 60 * 1000,
    path: '/',
    sameSite: 'lax',
    secure,
  });
}

function getCookieDomain(config: ConfigService) {
  return config.get<string>('COOKIE_DOMAIN')?.trim() || undefined;
}
