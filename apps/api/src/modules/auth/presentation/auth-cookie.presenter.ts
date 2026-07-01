import type { Response } from 'express';
import type { ConfigService } from '@nestjs/config';
import {
  ACCESS_TOKEN_COOKIE,
  CSRF_TOKEN_COOKIE,
  MFA_CHALLENGE_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from '../application/auth.service';
import type { AuthTokens } from '../application/auth.types';

export function setAuthCookies(response: Response, tokens: AuthTokens, config: ConfigService) {
  const secure = config.get<string>('NODE_ENV') === 'production';
  const domain = getCookieDomain(config);

  response.cookie(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
    domain,
    httpOnly: true,
    maxAge: parseDurationMs(config.get<string>('ACCESS_TOKEN_EXPIRES_IN', '15m')),
    path: '/',
    sameSite: 'lax',
    secure,
  });
  response.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
    domain,
    httpOnly: true,
    maxAge: parseDurationMs(config.get<string>('REFRESH_TOKEN_EXPIRES_IN', '30d')),
    path: '/',
    sameSite: 'lax',
    secure,
  });
}

export function setMfaChallengeCookie(
  response: Response,
  challengeToken: string,
  config: ConfigService,
) {
  const secure = config.get<string>('NODE_ENV') === 'production';
  const domain = getCookieDomain(config);

  response.cookie(MFA_CHALLENGE_COOKIE, challengeToken, {
    domain,
    httpOnly: true,
    maxAge: 5 * 60 * 1000,
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
  clearMfaChallengeCookie(response, config);
}

export function clearMfaChallengeCookie(response: Response, config: ConfigService) {
  const secure = config.get<string>('NODE_ENV') === 'production';
  const domain = getCookieDomain(config);
  response.clearCookie(MFA_CHALLENGE_COOKIE, { domain, path: '/', sameSite: 'lax', secure });
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

function parseDurationMs(value: string) {
  const match = /^(?<amount>\d+)(?<unit>[smhd])$/.exec(value);

  if (!match?.groups) {
    return 30 * 24 * 60 * 60 * 1000;
  }

  const amount = Number(match.groups.amount);
  const unit = match.groups.unit;

  switch (unit) {
    case 's':
      return amount * 1000;
    case 'm':
      return amount * 60 * 1000;
    case 'h':
      return amount * 60 * 60 * 1000;
    case 'd':
      return amount * 24 * 60 * 60 * 1000;
    default:
      return 30 * 24 * 60 * 60 * 1000;
  }
}
