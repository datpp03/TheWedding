import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TENANT_VISIBILITY, type TenantVisibility } from '@the-wedding/shared';
import {
  AUDIT_LOG_REPOSITORY,
  type AuditLogRepository,
} from '../../audit-logs/domain/audit-log.repository';
import { Argon2PasswordHasher } from '../../auth/infrastructure/argon2-password-hasher';
import {
  assertTenantMember,
  assertValidSlug,
  canReadPublicTenant,
  normalizeSlug,
  type TenantSeo,
  type TenantSettings,
  type TenantSharing,
} from '../domain/tenant';
import { TENANT_REPOSITORY, type TenantRepository } from '../domain/tenant.repository';

export type TenantMutationContext = {
  actorUserId: string;
  ipAddress?: string;
  userAgent?: string;
};

export type CreateTenantCommand = {
  siteName: string;
  slug: string;
  brideName?: string | null;
  groomName?: string | null;
  weddingDate?: string | null;
  description?: string | null;
};

export type UpdateTenantCommand = Partial<CreateTenantCommand> & {
  seo?: TenantSeo;
  sharing?: TenantSharing;
};

@Injectable()
export class TenantsService {
  constructor(
    @Inject(TENANT_REPOSITORY)
    private readonly tenants: TenantRepository,
    @Inject(AUDIT_LOG_REPOSITORY)
    private readonly auditLogs: AuditLogRepository,
    private readonly passwordHasher: Argon2PasswordHasher,
  ) {}

  list(userId: string) {
    return this.tenants.listForUser(userId);
  }

  async create(command: CreateTenantCommand, context: TenantMutationContext) {
    const slug = normalizeAndValidateSlug(command.slug);
    await this.assertSlugAvailable(slug);

    const tenant = await this.tenants.create({
      ownerUserId: context.actorUserId,
      slug,
      siteName: command.siteName.trim(),
      brideName: cleanNullable(command.brideName),
      groomName: cleanNullable(command.groomName),
      weddingDate: command.weddingDate ?? null,
      description: cleanNullable(command.description),
      visibility: TENANT_VISIBILITY.PRIVATE,
    });

    await this.auditLogs.append({
      actorUserId: context.actorUserId,
      tenantId: tenant.id,
      action: 'tenant.created',
      entityType: 'tenant',
      entityId: tenant.id,
      metadata: { slug: tenant.slug },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
    });

    return tenant;
  }

  async get(tenantId: string, userId: string) {
    const tenant = await this.tenants.findByIdForUser(tenantId, userId);
    assertTenantMember(tenant);
    return tenant;
  }

  async update(tenantId: string, command: UpdateTenantCommand, context: TenantMutationContext) {
    await this.get(tenantId, context.actorUserId);

    const slug = command.slug === undefined ? undefined : normalizeAndValidateSlug(command.slug);
    if (slug) {
      await this.assertSlugAvailable(slug, tenantId);
    }

    const tenant = await this.tenants.update(tenantId, {
      slug,
      siteName: command.siteName?.trim(),
      brideName: cleanNullable(command.brideName),
      groomName: cleanNullable(command.groomName),
      weddingDate: command.weddingDate,
      description: cleanNullable(command.description),
      seo: command.seo,
      sharing: command.sharing,
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    await this.auditLogs.append({
      actorUserId: context.actorUserId,
      tenantId,
      action: 'tenant.updated',
      entityType: 'tenant',
      entityId: tenantId,
      metadata: { fields: Object.keys(command) },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
    });

    return tenant;
  }

  async updateSettings(tenantId: string, settings: TenantSettings, context: TenantMutationContext) {
    await this.get(tenantId, context.actorUserId);
    const tenant = await this.tenants.update(tenantId, { settings });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    await this.auditLogs.append({
      actorUserId: context.actorUserId,
      tenantId,
      action: 'tenant.settings_updated',
      entityType: 'tenant',
      entityId: tenantId,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
    });

    return tenant;
  }

  async updateVisibility(
    tenantId: string,
    visibility: TenantVisibility,
    password: string | undefined,
    context: TenantMutationContext,
  ) {
    const currentTenant = await this.get(tenantId, context.actorUserId);
    if (
      visibility === TENANT_VISIBILITY.PASSWORD_PROTECTED &&
      currentTenant.visibility !== TENANT_VISIBILITY.PASSWORD_PROTECTED &&
      !password
    ) {
      throw new BadRequestException('A password is required when enabling password protection');
    }

    const passwordHash =
      visibility === TENANT_VISIBILITY.PASSWORD_PROTECTED
        ? await this.hashOptionalPassword(password)
        : null;
    const tenant = await this.tenants.update(tenantId, { visibility, passwordHash });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    await this.auditLogs.append({
      actorUserId: context.actorUserId,
      tenantId,
      action: 'tenant.visibility_updated',
      entityType: 'tenant',
      entityId: tenantId,
      metadata: { visibility },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
    });

    return tenant;
  }

  async delete(tenantId: string, context: TenantMutationContext) {
    await this.get(tenantId, context.actorUserId);
    await this.tenants.softDelete(tenantId);
    await this.auditLogs.append({
      actorUserId: context.actorUserId,
      tenantId,
      action: 'tenant.deleted',
      entityType: 'tenant',
      entityId: tenantId,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
    });

    return { deleted: true };
  }

  async checkSlug(slugValue: string, excludeTenantId?: string) {
    const slug = normalizeAndValidateSlug(slugValue);

    return {
      slug,
      available: await this.tenants.isSlugAvailable(slug, excludeTenantId),
    };
  }

  async getPublicSite(slugValue: string, password?: string) {
    const slug = normalizeAndValidateSlug(slugValue);
    const tenant = await this.tenants.findPublicBySlug(slug);
    const hasValidPassword =
      Boolean(tenant?.passwordHash && password) &&
      (await this.passwordHasher.verify(tenant?.passwordHash ?? '', password ?? ''));
    const publicTenant = canReadPublicTenant(tenant, hasValidPassword);

    if (!publicTenant) {
      throw new NotFoundException('Public site not found');
    }

    return publicTenant;
  }

  private async assertSlugAvailable(slug: string, excludeTenantId?: string) {
    if (!(await this.tenants.isSlugAvailable(slug, excludeTenantId))) {
      throw new ConflictException('Slug is already in use');
    }
  }

  private async hashOptionalPassword(password: string | undefined) {
    if (!password) {
      return undefined;
    }

    if (password.length < 8) {
      throw new BadRequestException('A password of at least 8 characters is required');
    }

    return this.passwordHasher.hash(password);
  }
}

function normalizeAndValidateSlug(value: string) {
  const slug = normalizeSlug(value);
  assertValidSlug(slug);
  return slug;
}

function cleanNullable(value: string | null | undefined) {
  if (value === undefined) {
    return undefined;
  }

  const cleanValue = value?.trim();
  return cleanValue ? cleanValue : null;
}
