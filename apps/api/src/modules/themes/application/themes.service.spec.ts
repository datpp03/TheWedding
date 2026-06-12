import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { createThemeFromPreset, type WeddingTheme } from '@the-wedding/shared';
import type { AuditLogRepository } from '../../audit-logs/domain/audit-log.repository';
import type { TenantsService } from '../../tenants/application/tenants.service';
import type { ThemeRepository } from '../domain/theme.repository';
import { ThemesService } from './themes.service';

describe(ThemesService.name, () => {
  it('rejects invalid theme settings at the application layer', () => {
    const { service } = createService();

    expect(() =>
      service.preview({
        ...createTheme(),
        colors: {
          ...createTheme().colors,
          primary: 'hotpink',
        },
      }),
    ).toThrow(BadRequestException);
  });

  it('denies tenant theme reads when tenant access is missing', async () => {
    const { tenants, service } = createService();
    tenants.get.mockRejectedValue(new ForbiddenException('Tenant access denied'));

    await expect(service.list('tenant-2', context)).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('activates a tenant theme and records an audit event', async () => {
    const { auditLogs, repository, service } = createService();
    repository.activate.mockResolvedValue(createTheme({ id: 'theme-1', isActive: true }));

    await expect(service.activate('tenant-1', 'theme-1', context)).resolves.toEqual(
      expect.objectContaining({ id: 'theme-1', isActive: true }),
    );
    expect(repository.activate.mock.calls[0]).toEqual(['tenant-1', 'theme-1']);
    expect(auditLogs.append.mock.calls[0]?.[0]).toEqual(
      expect.objectContaining({
        action: 'theme.activated',
        entityId: 'theme-1',
        tenantId: 'tenant-1',
      }),
    );
  });

  it('resets tenant themes to one active preset', async () => {
    const { repository, service } = createService();
    repository.create.mockResolvedValue(createTheme({ id: 'reset-theme', isActive: true }));

    await service.reset('tenant-1', context, 'city-pop');

    expect(repository.deleteForTenant.mock.calls[0]).toEqual(['tenant-1']);
    expect(repository.create.mock.calls[0]?.[0]).toEqual(
      expect.objectContaining({
        isActive: true,
        presetId: 'city-pop',
        tenantId: 'tenant-1',
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
  const repository: jest.Mocked<ThemeRepository> = {
    activate: jest.fn(),
    create: jest.fn(),
    deleteForTenant: jest.fn(),
    findActive: jest.fn(),
    findById: jest.fn(),
    listByTenant: jest.fn(),
    update: jest.fn(),
  };
  const auditLogs: jest.Mocked<AuditLogRepository> = {
    append: jest.fn().mockResolvedValue(undefined),
  };
  const tenants = {
    get: jest.fn().mockResolvedValue({ id: 'tenant-1' }),
  } as unknown as jest.Mocked<TenantsService>;

  repository.listByTenant.mockResolvedValue([createTheme()]);
  repository.create.mockResolvedValue(createTheme());

  return {
    auditLogs,
    repository,
    service: new ThemesService(repository, auditLogs, tenants),
    tenants,
  };
}

function createTheme(overrides: Partial<WeddingTheme> = {}): WeddingTheme {
  return {
    ...createThemeFromPreset('neon-romance'),
    id: 'theme-1',
    isActive: false,
    tenantId: 'tenant-1',
    ...overrides,
  };
}
