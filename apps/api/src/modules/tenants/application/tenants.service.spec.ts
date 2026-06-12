import { ConflictException, ForbiddenException } from '@nestjs/common';
import { TENANT_VISIBILITY } from '@the-wedding/shared';
import type { AuditLogRepository } from '../../audit-logs/domain/audit-log.repository';
import type { Argon2PasswordHasher } from '../../auth/infrastructure/argon2-password-hasher';
import type { TenantView } from '../domain/tenant';
import type { TenantRepository } from '../domain/tenant.repository';
import { TenantsService } from './tenants.service';

describe(TenantsService.name, () => {
  it('creates a tenant and records the owner audit event', async () => {
    const { auditLogs, repository, service } = createService();
    repository.isSlugAvailable.mockResolvedValue(true);
    repository.create.mockResolvedValue(createTenant());

    const result = await service.create(
      {
        siteName: ' Linh & An ',
        slug: ' Linh & An ',
      },
      context,
    );

    expect(repository.create.mock.calls[0]?.[0]).toEqual(
      expect.objectContaining({
        ownerUserId: 'user-1',
        siteName: 'Linh & An',
        slug: 'linh-an',
        visibility: TENANT_VISIBILITY.PRIVATE,
      }),
    );
    expect(auditLogs.append.mock.calls[0]?.[0]).toEqual(
      expect.objectContaining({
        action: 'tenant.created',
        tenantId: result.id,
      }),
    );
  });

  it('rejects duplicate slugs', async () => {
    const { repository, service } = createService();
    repository.isSlugAvailable.mockResolvedValue(false);

    await expect(
      service.create(
        {
          siteName: 'Linh & An',
          slug: 'linh-an',
        },
        context,
      ),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('denies cross-tenant access when the repository cannot find membership', async () => {
    const { repository, service } = createService();
    repository.findByIdForUser.mockResolvedValue(null);

    await expect(service.get('tenant-2', 'user-1')).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('returns public slug data when visibility permits it', async () => {
    const { repository, service } = createService();
    repository.findPublicBySlug.mockResolvedValue({
      ...createTenant({ visibility: TENANT_VISIBILITY.PUBLIC }),
      passwordHash: null,
    });

    await expect(service.getPublicSite('linh-an')).resolves.toEqual(
      expect.objectContaining({
        requiresPassword: false,
        slug: 'linh-an',
      }),
    );
  });
});

const context = {
  actorUserId: 'user-1',
  ipAddress: '127.0.0.1',
  userAgent: 'jest',
};

function createService() {
  const repository: jest.Mocked<TenantRepository> = {
    create: jest.fn(),
    findByIdForUser: jest.fn<Promise<TenantView | null>, [string, string]>(),
    findPublicBySlug: jest.fn(),
    isSlugAvailable: jest.fn<Promise<boolean>, [string, string?]>(),
    listForUser: jest.fn<Promise<TenantView[]>, [string]>(),
    softDelete: jest.fn<Promise<void>, [string]>(),
    update: jest.fn(),
  };
  const auditLogs: jest.Mocked<AuditLogRepository> = {
    append: jest.fn().mockResolvedValue(undefined),
  };
  const passwordHasher = {
    hash: jest.fn<Promise<string>, [string]>().mockResolvedValue('hash:secret'),
    verify: jest.fn<Promise<boolean>, [string, string]>().mockResolvedValue(true),
  } as jest.Mocked<Argon2PasswordHasher>;

  return {
    auditLogs,
    repository,
    service: new TenantsService(repository, auditLogs, passwordHasher),
  };
}

function createTenant(overrides: Partial<TenantView> = {}): TenantView {
  return {
    id: 'tenant-1',
    ownerUserId: 'user-1',
    slug: 'linh-an',
    siteName: 'Linh & An',
    brideName: null,
    groomName: null,
    weddingDate: null,
    description: null,
    visibility: TENANT_VISIBILITY.PRIVATE,
    customDomain: null,
    status: 'active',
    settings: {},
    seo: {},
    sharing: {},
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    ...overrides,
  };
}
