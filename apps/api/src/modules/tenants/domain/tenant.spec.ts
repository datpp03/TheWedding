import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { TENANT_VISIBILITY } from '@the-wedding/shared';
import {
  assertTenantMember,
  assertValidSlug,
  canReadPublicTenant,
  normalizeSlug,
  type TenantView,
} from './tenant';

describe('tenant domain rules', () => {
  it('normalizes public slugs into stable URL segments', () => {
    expect(normalizeSlug(' Linh & An Wedding!! ')).toBe('linh-an-wedding');
  });

  it('rejects invalid slugs', () => {
    expect(() => assertValidSlug('ab')).toThrow(BadRequestException);
    expect(() => assertValidSlug('valid-slug-01')).not.toThrow();
  });

  it('denies tenant access when the user is not a member', () => {
    expect(() => assertTenantMember(null)).toThrow(ForbiddenException);
  });

  it('returns public site data for public tenants', () => {
    expect(
      canReadPublicTenant(createTenant({ visibility: TENANT_VISIBILITY.PUBLIC }), false),
    ).toEqual(
      expect.objectContaining({
        requiresPassword: false,
        siteName: 'Linh & An',
      }),
    );
  });

  it('gates password-protected tenants until a valid password is supplied', () => {
    const tenant = createTenant({
      description: 'Private details',
      visibility: TENANT_VISIBILITY.PASSWORD_PROTECTED,
    });

    expect(canReadPublicTenant(tenant, false)).toEqual(
      expect.objectContaining({
        description: null,
        requiresPassword: true,
      }),
    );
    expect(canReadPublicTenant(tenant, true)).toEqual(
      expect.objectContaining({
        description: 'Private details',
        requiresPassword: false,
      }),
    );
  });

  it('hides disabled or missing tenants from public reads', () => {
    expect(canReadPublicTenant(null, false)).toBeNull();
    expect(canReadPublicTenant(createTenant({ status: 'disabled' }), false)).toBeNull();
  });
});

function createTenant(overrides: Partial<TenantView> = {}): TenantView {
  return {
    id: 'tenant-1',
    ownerUserId: 'user-1',
    slug: 'linh-an',
    siteName: 'Linh & An',
    brideName: 'Linh',
    groomName: 'An',
    weddingDate: '2026-12-24',
    description: 'Private details',
    visibility: TENANT_VISIBILITY.PUBLIC,
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
