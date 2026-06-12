export const TENANT_REPOSITORY = Symbol('TENANT_REPOSITORY');

import type { WeddingTheme } from '@the-wedding/shared';
import type { TenantSeo, TenantSettings, TenantSharing, TenantView } from './tenant';

export type CreateTenantInput = {
  ownerUserId: string;
  slug: string;
  siteName: string;
  brideName?: string | null;
  groomName?: string | null;
  weddingDate?: string | null;
  description?: string | null;
  visibility?: string;
  passwordHash?: string | null;
  settings?: TenantSettings;
  seo?: TenantSeo;
  sharing?: TenantSharing;
};

export type UpdateTenantInput = Partial<
  Pick<
    CreateTenantInput,
    | 'brideName'
    | 'description'
    | 'groomName'
    | 'passwordHash'
    | 'seo'
    | 'settings'
    | 'sharing'
    | 'siteName'
    | 'slug'
    | 'visibility'
    | 'weddingDate'
  >
>;

export interface TenantRepository {
  create(input: CreateTenantInput): Promise<TenantView>;
  findByIdForUser(tenantId: string, userId: string): Promise<TenantView | null>;
  findPublicBySlug(
    slug: string,
  ): Promise<
    (TenantView & { activeTheme?: WeddingTheme | null; passwordHash: string | null }) | null
  >;
  isSlugAvailable(slug: string, excludeTenantId?: string): Promise<boolean>;
  listForUser(userId: string): Promise<TenantView[]>;
  softDelete(tenantId: string): Promise<void>;
  update(tenantId: string, input: UpdateTenantInput): Promise<TenantView | null>;
}
