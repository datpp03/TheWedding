import type { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { setAuthCookies } from './auth-cookie.presenter';

describe('auth cookie presenter', () => {
  it('uses access and refresh token TTL values from environment', () => {
    const response = {
      cookie: jest.fn(),
    };
    const config = createConfig({
      ACCESS_TOKEN_EXPIRES_IN: '10m',
      REFRESH_TOKEN_EXPIRES_IN: '14d',
    });

    setAuthCookies(
      response as unknown as Response,
      {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      },
      config as unknown as ConfigService,
    );

    expect(response.cookie).toHaveBeenCalledWith(
      'access_token',
      'access-token',
      expect.objectContaining({
        httpOnly: true,
        maxAge: 10 * 60 * 1000,
        sameSite: 'lax',
      }),
    );
    expect(response.cookie).toHaveBeenCalledWith(
      'refresh_token',
      'refresh-token',
      expect.objectContaining({
        httpOnly: true,
        maxAge: 14 * 24 * 60 * 60 * 1000,
        sameSite: 'lax',
      }),
    );
  });
});

function createConfig(values: Record<string, string>) {
  return {
    get: jest.fn((key: string, defaultValue?: unknown) => values[key] ?? defaultValue),
  };
}
