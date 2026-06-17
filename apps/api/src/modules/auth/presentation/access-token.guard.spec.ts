import { ForbiddenException } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessTokenGuard } from './access-token.guard';

describe(AccessTokenGuard.name, () => {
  function createGuard() {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(false),
    } as unknown as Reflector;
    const tokenService = {
      verifyAccessToken: jest.fn().mockResolvedValue({
        id: 'user-1',
        tenantIds: ['tenant-1'],
      }),
    };

    return {
      guard: new AccessTokenGuard(reflector, tokenService as never),
      tokenService,
    };
  }

  function createContext(request: Record<string, unknown>): ExecutionContext {
    return {
      getClass: jest.fn(),
      getHandler: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as unknown as ExecutionContext;
  }

  it('rejects unsafe mutations with an invalid CSRF token', async () => {
    const { guard } = createGuard();
    const request = {
      cookies: { access_token: 'access', csrf_token: 'cookie-token' },
      headers: { 'x-csrf-token': 'header-token' },
      method: 'DELETE',
    };

    await expect(guard.canActivate(createContext(request))).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('allows safe methods without CSRF comparison', async () => {
    const { guard } = createGuard();
    const request = {
      cookies: { access_token: 'access' },
      headers: {},
      method: 'GET',
    };

    await expect(guard.canActivate(createContext(request))).resolves.toBe(true);
  });
});
