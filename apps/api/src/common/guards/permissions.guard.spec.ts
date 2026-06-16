import { ForbiddenException } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS } from '@the-wedding/shared';
import { PermissionsGuard } from './permissions.guard';

describe(PermissionsGuard.name, () => {
  function createGuard(requiredPermissions: string[]) {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(requiredPermissions),
    } as unknown as Reflector;
    return new PermissionsGuard(reflector);
  }

  function createContext(permissions: string[]): ExecutionContext {
    return {
      getClass: jest.fn(),
      getHandler: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ user: { permissions } }),
      }),
    } as unknown as ExecutionContext;
  }

  it('allows users with admin access permission', () => {
    const guard = createGuard([PERMISSIONS.ADMIN_ACCESS]);

    expect(guard.canActivate(createContext([PERMISSIONS.ADMIN_ACCESS]))).toBe(true);
  });

  it('denies users missing admin access permission', () => {
    const guard = createGuard([PERMISSIONS.ADMIN_ACCESS]);

    expect(() => guard.canActivate(createContext([PERMISSIONS.USER_READ]))).toThrow(
      ForbiddenException,
    );
  });
});
