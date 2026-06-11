import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { PermissionCode } from '@the-wedding/shared';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import type { RequestWithUser } from '../types/express-request';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<PermissionCode[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const userPermissions = request.user?.permissions ?? [];
    const allowed = requiredPermissions.every((permission) => userPermissions.includes(permission));

    if (!allowed) {
      throw new ForbiddenException('Required permission is missing');
    }

    return true;
  }
}
