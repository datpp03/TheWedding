import type { WeddingTheme } from '@the-wedding/shared';
import { apiClient } from '@/lib/api-client';

export type Theme = WeddingTheme & {
  createdAt: string;
  id: string;
  isActive: boolean;
  tenantId: string;
  updatedAt: string;
};

export function listThemes(tenantId: string) {
  return apiClient<Theme[]>(`/tenants/${tenantId}/themes`);
}

export function createTheme(
  tenantId: string,
  input: Partial<WeddingTheme> & { activate?: boolean },
) {
  return apiClient<Theme>(`/tenants/${tenantId}/themes`, {
    body: JSON.stringify(input),
    method: 'POST',
  });
}

export function updateTheme(tenantId: string, themeId: string, input: Partial<WeddingTheme>) {
  return apiClient<Theme>(`/tenants/${tenantId}/themes/${themeId}`, {
    body: JSON.stringify(input),
    method: 'PATCH',
  });
}

export function activateTheme(tenantId: string, themeId: string) {
  return apiClient<Theme>(`/tenants/${tenantId}/themes/${themeId}/activate`, {
    method: 'PATCH',
  });
}

export function cloneTheme(tenantId: string, themeId: string) {
  return apiClient<Theme>(`/tenants/${tenantId}/themes/${themeId}/clone`, {
    method: 'POST',
  });
}

export function resetTheme(tenantId: string, presetId?: string) {
  const suffix = presetId ? `?presetId=${encodeURIComponent(presetId)}` : '';
  return apiClient<Theme>(`/tenants/${tenantId}/themes/reset${suffix}`, {
    method: 'POST',
  });
}
