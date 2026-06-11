import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { ROLES } from '@the-wedding/shared';
import type { RequestWithUser } from '../types/express-request';

@Injectable()
export class TenantAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    const body = request.body as { tenantId?: unknown } | undefined;
    const bodyTenantId = typeof body?.tenantId === 'string' ? body.tenantId : undefined;
    const tenantId =
      getFirstParamValue(request.params.tenantId) ??
      getFirstParamValue(request.params.id) ??
      bodyTenantId;

    if (!tenantId || !user) {
      throw new ForbiddenException('Tenant access could not be verified');
    }

    if (user.roles.includes(ROLES.SUPER_ADMIN) || user.roles.includes(ROLES.ADMIN)) {
      return true;
    }

    if (!user.tenantIds.includes(tenantId)) {
      throw new ForbiddenException('Tenant access denied');
    }

    return true;
  }
}

function getFirstParamValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
