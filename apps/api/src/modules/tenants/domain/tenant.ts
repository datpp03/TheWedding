import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { TENANT_VISIBILITY, type TenantVisibility, type WeddingTheme } from '@the-wedding/shared';

export type TenantSettings = {
  accentColor?: string;
  coverImageUrl?: string;
  welcomeMessage?: string;
};

export type TenantSeo = {
  title?: string;
  description?: string;
  imageUrl?: string;
};

export type TenantSharing = {
  headline?: string;
  summary?: string;
  imageUrl?: string;
};

export type TenantView = {
  id: string;
  ownerUserId: string;
  slug: string;
  siteName: string;
  brideName: string | null;
  groomName: string | null;
  weddingDate: string | null;
  description: string | null;
  visibility: TenantVisibility;
  customDomain: string | null;
  status: string;
  settings: TenantSettings;
  seo: TenantSeo;
  sharing: TenantSharing;
  createdAt: Date;
  updatedAt: Date;
};

export type PublicTenantView = Omit<TenantView, 'ownerUserId' | 'customDomain' | 'status'> & {
  activeTheme?: WeddingTheme | null;
  requiresPassword: boolean;
};

export function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

export function assertValidSlug(slug: string) {
  if (!/^[a-z0-9](?:[a-z0-9-]{1,58}[a-z0-9])$/.test(slug)) {
    throw new BadRequestException(
      'Slug must be 3-60 characters and contain only lowercase letters, numbers, and hyphens',
    );
  }
}

export function assertTenantMember(tenant: TenantView | null): asserts tenant is TenantView {
  if (!tenant) {
    throw new ForbiddenException('Tenant access denied');
  }
}

export function canReadPublicTenant(
  tenant: TenantView | null,
  hasValidPassword: boolean,
): PublicTenantView | null {
  if (!tenant || tenant.status !== 'active') {
    return null;
  }

  if (tenant.visibility === TENANT_VISIBILITY.PRIVATE) {
    return {
      ...tenant,
      description: null,
      requiresPassword: true,
    };
  }

  if (tenant.visibility === TENANT_VISIBILITY.PASSWORD_PROTECTED && !hasValidPassword) {
    return {
      ...tenant,
      description: null,
      requiresPassword: true,
    };
  }

  return {
    ...tenant,
    requiresPassword: false,
  };
}
