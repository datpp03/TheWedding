import { apiClient } from '@/lib/api-client';
import type { TenantVisibility } from '@the-wedding/shared';

export type Tenant = {
  id: string;
  slug: string;
  siteName: string;
  brideName: string | null;
  groomName: string | null;
  weddingDate: string | null;
  description: string | null;
  visibility: TenantVisibility;
  settings: {
    accentColor?: string;
    coverImageUrl?: string;
    welcomeMessage?: string;
  };
  seo: {
    title?: string;
    description?: string;
    imageUrl?: string;
  };
  sharing: {
    headline?: string;
    summary?: string;
    imageUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type PublicTenant = Tenant & {
  requiresPassword: boolean;
};

export type CreateTenantInput = {
  siteName: string;
  slug: string;
  brideName?: string;
  groomName?: string;
  weddingDate?: string;
  description?: string;
};

export type UpdateTenantInput = Partial<CreateTenantInput> & {
  seo?: Tenant['seo'];
  sharing?: Tenant['sharing'];
};

export function listTenants() {
  return apiClient<Tenant[]>('/tenants');
}

export function createTenant(input: CreateTenantInput) {
  return apiClient<Tenant>('/tenants', {
    body: JSON.stringify(input),
    method: 'POST',
  });
}

export function updateTenant(tenantId: string, input: UpdateTenantInput) {
  return apiClient<Tenant>(`/tenants/${tenantId}`, {
    body: JSON.stringify(input),
    method: 'PATCH',
  });
}

export function updateTenantSettings(tenantId: string, settings: Tenant['settings']) {
  return apiClient<Tenant>(`/tenants/${tenantId}/settings`, {
    body: JSON.stringify(settings),
    method: 'PATCH',
  });
}

export function updateTenantVisibility(
  tenantId: string,
  visibility: TenantVisibility,
  password?: string,
) {
  return apiClient<Tenant>(`/tenants/${tenantId}/visibility`, {
    body: JSON.stringify({ password, visibility }),
    method: 'PATCH',
  });
}

export function checkTenantSlug(slug: string, excludeTenantId?: string) {
  const params = new URLSearchParams({ slug });
  if (excludeTenantId) {
    params.set('excludeTenantId', excludeTenantId);
  }

  return apiClient<{ available: boolean; slug: string }>(`/tenants/slug-check?${params}`);
}
