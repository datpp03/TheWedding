import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { RoleCode } from '@the-wedding/shared';
import { ROLES_KEY } from '../decorators/roles.decorator';
import type { RequestWithUser } from '../types/express-request';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleCode[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const userRoles = request.user?.roles ?? [];
    const allowed = requiredRoles.some((role) => userRoles.includes(role));

    if (!allowed) {
      throw new ForbiddenException('Required role is missing');
    }

    return true;
  }
}
