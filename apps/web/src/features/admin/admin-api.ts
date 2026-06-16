import { apiClient } from '@/lib/api-client';

export type PageResult<T> = {
  items: T[];
  limit: number;
  page: number;
  total: number;
  totalPages: number;
};

export type AdminStats = {
  activeTenants: number;
  activeUsers: number;
  auditEvents: number;
  mediaTotal: number;
  pendingMedia: number;
  tenantsTotal: number;
  usersTotal: number;
};

export type AdminUser = {
  id: string;
  email: string;
  displayName: string;
  status: string;
  createdAt: string;
  roles?: string[];
};

export type AdminTenant = {
  id: string;
  slug: string;
  siteName: string;
  status: string;
  visibility: string;
  ownerUserId: string;
  createdAt: string;
};

export type AdminMedia = {
  id: string;
  originalFileName: string;
  processingStatus: string;
  mimeType: string;
  sizeBytes: string;
  tenantId: string;
  createdAt: string;
};

export type AuditLog = {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  actorUserId: string | null;
  tenantId: string | null;
  createdAt: string;
};

export type SystemSetting = {
  id: string;
  key: string;
  valueJson: string;
  description: string | null;
};

export type FeatureFlag = {
  id: string;
  key: string;
  enabled: boolean;
  description: string | null;
  rulesJson: string | null;
};

export type SystemParameters = {
  disableDownloads: boolean;
  disableLogin: boolean;
  disableNewUserRegistration: boolean;
  disablePaymentCheckout: boolean;
  disablePublicGallery: boolean;
  disableUploads: boolean;
  maintenanceMessage: string;
};

export function getAdminStats() {
  return apiClient<AdminStats>('/admin/stats');
}

export function listAdminUsers(params = '') {
  return apiClient<PageResult<AdminUser>>(`/admin/users${params}`);
}

export function updateAdminUserStatus(id: string, status: string) {
  return apiClient<AdminUser>(`/admin/users/${id}/status`, {
    body: JSON.stringify({ status }),
    method: 'PATCH',
  });
}

export function listAdminTenants(params = '') {
  return apiClient<PageResult<AdminTenant>>(`/admin/tenants${params}`);
}

export function updateAdminTenantStatus(id: string, status: string) {
  return apiClient<AdminTenant>(`/admin/tenants/${id}/status`, {
    body: JSON.stringify({ status }),
    method: 'PATCH',
  });
}

export function listAdminMedia(params = '') {
  return apiClient<PageResult<AdminMedia>>(`/admin/media${params}`);
}

export function updateAdminMediaStatus(id: string, processingStatus: string) {
  return apiClient<AdminMedia>(`/admin/media/${id}/moderation`, {
    body: JSON.stringify({ processingStatus }),
    method: 'PATCH',
  });
}

export function listAuditLogs(params = '') {
  return apiClient<PageResult<AuditLog>>(`/admin/audit-logs${params}`);
}

export function listSystemSettings() {
  return apiClient<SystemSetting[]>('/admin/settings');
}

export function listFeatureFlags() {
  return apiClient<FeatureFlag[]>('/admin/feature-flags');
}

export function upsertFeatureFlag(input: { key: string; enabled: boolean; description?: string }) {
  return apiClient<FeatureFlag>('/admin/feature-flags', {
    body: JSON.stringify(input),
    method: 'POST',
  });
}

export function getSystemParameters() {
  return apiClient<SystemParameters>('/admin/system-parameters');
}

export function updateSystemParameters(input: SystemParameters) {
  return apiClient<SystemParameters>('/admin/system-parameters', {
    body: JSON.stringify(input),
    method: 'PATCH',
  });
}
