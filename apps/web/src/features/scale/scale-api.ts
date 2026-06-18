import { apiClient } from '@/lib/api-client';
import type { ScaleAddOn, ScaleFeatureKey, ScalePlan, ScalePlanLimits } from '@the-wedding/shared';

export type ScaleCatalog = {
  addOns: ScaleAddOn[];
  featureFlags: Record<ScaleFeatureKey, string>;
  plans: ScalePlan[];
};

export type ScaleAdminOverview = {
  analyticsEvents: number;
  catalog: ScaleCatalog;
  customDomains: number;
  entitlements: number;
  greetingRules: number;
  paymentEvents: number;
  studioClients: number;
  studioProfiles: number;
  subscriptions: number;
};

export type ScaleTenantSummary = {
  canonicalAlbumUrlTemplate: string | null;
  enabledFeatures: string[];
  limits: ScalePlanLimits;
  plan: ScalePlan;
  storage: {
    mediaCount: number;
    storageBytes: number;
  };
  tenantId: string;
  tenantSlug: string;
};

export function getScaleAdminOverview() {
  return apiClient<ScaleAdminOverview>('/scale/admin/overview');
}

export function grantScaleEntitlement(input: {
  featureKey?: string;
  granted?: boolean;
  reason?: string;
  storageBoostBytes?: string;
  subjectId: string;
  subjectType: 'tenant' | 'user';
}) {
  return apiClient('/scale/admin/entitlements', {
    body: JSON.stringify(input),
    method: 'POST',
  });
}
