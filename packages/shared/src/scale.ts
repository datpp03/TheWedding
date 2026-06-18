export const SCALE_PLAN_IDS = {
  FREE: 'free',
  COUPLE_ESSENTIAL: 'couple_essential',
  COUPLE_PREMIUM: 'couple_premium',
  STUDIO_STARTER: 'studio_starter',
  STUDIO_PRO: 'studio_pro',
} as const;

export type ScalePlanId = (typeof SCALE_PLAN_IDS)[keyof typeof SCALE_PLAN_IDS];

export const SCALE_SEGMENTS = {
  B2C: 'b2c_couple',
  B2B: 'b2b_studio',
} as const;

export type ScaleSegment = (typeof SCALE_SEGMENTS)[keyof typeof SCALE_SEGMENTS];

export const SCALE_FEATURES = {
  ADVANCED_ANALYTICS: 'advanced_analytics',
  ADVANCED_PRIVACY: 'advanced_privacy',
  AI_TAGGING: 'ai_tagging',
  CONTEXTUAL_THEMES: 'contextual_themes',
  CUSTOM_DOMAIN: 'custom_domain',
  GREETING_AUTOMATION: 'greeting_automation',
  ONLINE_EDITING: 'online_editing',
  PREMIUM_THEMES: 'premium_themes',
  REVIEW_LINKS: 'review_links',
  STUDIO_BRANDING: 'studio_branding',
  VIDEO_UPLOADS: 'video_uploads',
  WATERMARK: 'watermark',
} as const;

export type ScaleFeatureKey = (typeof SCALE_FEATURES)[keyof typeof SCALE_FEATURES];

export const SCALE_ADD_ON_IDS = {
  ADVANCED_SECURITY: 'advanced_security',
  AI_TOOLS: 'ai_tools',
  CUSTOM_DOMAIN: 'custom_domain',
  EXTRA_STORAGE_10GB: 'extra_storage_10gb',
  ONLINE_EDITING: 'online_editing',
  PREMIUM_THEMES: 'premium_themes',
  WATERMARK: 'watermark',
} as const;

export type ScaleAddOnId = (typeof SCALE_ADD_ON_IDS)[keyof typeof SCALE_ADD_ON_IDS];

export type ScalePlanLimits = {
  analyticsLevel: 'none' | 'basic' | 'advanced';
  customDomain: boolean;
  maxFileBytes: number;
  maxPhotoCount: number;
  maxVideoCount: number;
  maxVideoFileBytes: number;
  premiumThemes: boolean;
  privacyLevel: 'basic' | 'advanced';
  storageBytes: number;
  studioClients: number;
  supportLevel: 'community' | 'standard' | 'priority' | 'studio';
  videoSupport: boolean;
};

export type ScalePlan = {
  descriptionKey: string;
  id: ScalePlanId;
  labelKey: string;
  limits: ScalePlanLimits;
  segment: ScaleSegment;
};

export type ScaleAddOn = {
  descriptionKey: string;
  featureKeys: ScaleFeatureKey[];
  id: ScaleAddOnId;
  labelKey: string;
  segment: ScaleSegment | 'both';
  storageBoostBytes?: number;
};

export type EntitlementGrant = {
  expiresAt?: string | Date | null;
  featureKey?: ScaleFeatureKey | null;
  granted: boolean;
  storageBoostBytes?: number | null;
};

export const SCALE_PLANS: readonly ScalePlan[] = [
  {
    id: SCALE_PLAN_IDS.FREE,
    labelKey: 'scale.plans.free.name',
    descriptionKey: 'scale.plans.free.description',
    segment: SCALE_SEGMENTS.B2C,
    limits: {
      analyticsLevel: 'none',
      customDomain: false,
      maxFileBytes: 15 * 1024 * 1024,
      maxPhotoCount: 150,
      maxVideoCount: 0,
      maxVideoFileBytes: 0,
      premiumThemes: false,
      privacyLevel: 'basic',
      storageBytes: 1 * 1024 * 1024 * 1024,
      studioClients: 0,
      supportLevel: 'community',
      videoSupport: false,
    },
  },
  {
    id: SCALE_PLAN_IDS.COUPLE_ESSENTIAL,
    labelKey: 'scale.plans.coupleEssential.name',
    descriptionKey: 'scale.plans.coupleEssential.description',
    segment: SCALE_SEGMENTS.B2C,
    limits: {
      analyticsLevel: 'basic',
      customDomain: false,
      maxFileBytes: 40 * 1024 * 1024,
      maxPhotoCount: 1200,
      maxVideoCount: 8,
      maxVideoFileBytes: 200 * 1024 * 1024,
      premiumThemes: true,
      privacyLevel: 'advanced',
      storageBytes: 10 * 1024 * 1024 * 1024,
      studioClients: 0,
      supportLevel: 'standard',
      videoSupport: true,
    },
  },
  {
    id: SCALE_PLAN_IDS.COUPLE_PREMIUM,
    labelKey: 'scale.plans.couplePremium.name',
    descriptionKey: 'scale.plans.couplePremium.description',
    segment: SCALE_SEGMENTS.B2C,
    limits: {
      analyticsLevel: 'advanced',
      customDomain: true,
      maxFileBytes: 80 * 1024 * 1024,
      maxPhotoCount: 4000,
      maxVideoCount: 30,
      maxVideoFileBytes: 600 * 1024 * 1024,
      premiumThemes: true,
      privacyLevel: 'advanced',
      storageBytes: 40 * 1024 * 1024 * 1024,
      studioClients: 0,
      supportLevel: 'priority',
      videoSupport: true,
    },
  },
  {
    id: SCALE_PLAN_IDS.STUDIO_STARTER,
    labelKey: 'scale.plans.studioStarter.name',
    descriptionKey: 'scale.plans.studioStarter.description',
    segment: SCALE_SEGMENTS.B2B,
    limits: {
      analyticsLevel: 'basic',
      customDomain: true,
      maxFileBytes: 100 * 1024 * 1024,
      maxPhotoCount: 12000,
      maxVideoCount: 80,
      maxVideoFileBytes: 1024 * 1024 * 1024,
      premiumThemes: true,
      privacyLevel: 'advanced',
      storageBytes: 150 * 1024 * 1024 * 1024,
      studioClients: 25,
      supportLevel: 'studio',
      videoSupport: true,
    },
  },
  {
    id: SCALE_PLAN_IDS.STUDIO_PRO,
    labelKey: 'scale.plans.studioPro.name',
    descriptionKey: 'scale.plans.studioPro.description',
    segment: SCALE_SEGMENTS.B2B,
    limits: {
      analyticsLevel: 'advanced',
      customDomain: true,
      maxFileBytes: 150 * 1024 * 1024,
      maxPhotoCount: 50000,
      maxVideoCount: 300,
      maxVideoFileBytes: 2 * 1024 * 1024 * 1024,
      premiumThemes: true,
      privacyLevel: 'advanced',
      storageBytes: 1_000 * 1024 * 1024 * 1024,
      studioClients: 150,
      supportLevel: 'studio',
      videoSupport: true,
    },
  },
] as const;

export const SCALE_ADD_ONS: readonly ScaleAddOn[] = [
  {
    id: SCALE_ADD_ON_IDS.EXTRA_STORAGE_10GB,
    labelKey: 'scale.addons.extraStorage.name',
    descriptionKey: 'scale.addons.extraStorage.description',
    segment: 'both',
    featureKeys: [],
    storageBoostBytes: 10 * 1024 * 1024 * 1024,
  },
  {
    id: SCALE_ADD_ON_IDS.CUSTOM_DOMAIN,
    labelKey: 'scale.addons.customDomain.name',
    descriptionKey: 'scale.addons.customDomain.description',
    segment: SCALE_SEGMENTS.B2C,
    featureKeys: [SCALE_FEATURES.CUSTOM_DOMAIN],
  },
  {
    id: SCALE_ADD_ON_IDS.PREMIUM_THEMES,
    labelKey: 'scale.addons.premiumThemes.name',
    descriptionKey: 'scale.addons.premiumThemes.description',
    segment: 'both',
    featureKeys: [SCALE_FEATURES.PREMIUM_THEMES, SCALE_FEATURES.CONTEXTUAL_THEMES],
  },
  {
    id: SCALE_ADD_ON_IDS.ADVANCED_SECURITY,
    labelKey: 'scale.addons.advancedSecurity.name',
    descriptionKey: 'scale.addons.advancedSecurity.description',
    segment: 'both',
    featureKeys: [SCALE_FEATURES.ADVANCED_PRIVACY],
  },
  {
    id: SCALE_ADD_ON_IDS.WATERMARK,
    labelKey: 'scale.addons.watermark.name',
    descriptionKey: 'scale.addons.watermark.description',
    segment: 'both',
    featureKeys: [SCALE_FEATURES.WATERMARK],
  },
  {
    id: SCALE_ADD_ON_IDS.AI_TOOLS,
    labelKey: 'scale.addons.aiTools.name',
    descriptionKey: 'scale.addons.aiTools.description',
    segment: 'both',
    featureKeys: [SCALE_FEATURES.AI_TAGGING],
  },
  {
    id: SCALE_ADD_ON_IDS.ONLINE_EDITING,
    labelKey: 'scale.addons.onlineEditing.name',
    descriptionKey: 'scale.addons.onlineEditing.description',
    segment: 'both',
    featureKeys: [SCALE_FEATURES.ONLINE_EDITING],
  },
] as const;

export const SCALE_FEATURE_FLAGS: Record<ScaleFeatureKey, string> = {
  [SCALE_FEATURES.ADVANCED_ANALYTICS]: 'scale.analytics.advanced',
  [SCALE_FEATURES.ADVANCED_PRIVACY]: 'scale.privacy.advanced',
  [SCALE_FEATURES.AI_TAGGING]: 'scale.ai_tagging',
  [SCALE_FEATURES.CONTEXTUAL_THEMES]: 'scale.contextual_themes',
  [SCALE_FEATURES.CUSTOM_DOMAIN]: 'scale.custom_domain',
  [SCALE_FEATURES.GREETING_AUTOMATION]: 'scale.greeting_automation',
  [SCALE_FEATURES.ONLINE_EDITING]: 'scale.online_editing',
  [SCALE_FEATURES.PREMIUM_THEMES]: 'scale.premium_themes',
  [SCALE_FEATURES.REVIEW_LINKS]: 'scale.review_links',
  [SCALE_FEATURES.STUDIO_BRANDING]: 'scale.studio_branding',
  [SCALE_FEATURES.VIDEO_UPLOADS]: 'scale.video_uploads',
  [SCALE_FEATURES.WATERMARK]: 'scale.watermark',
};

export function getScalePlan(planId: string | null | undefined): ScalePlan {
  return SCALE_PLANS.find((plan) => plan.id === planId) ?? SCALE_PLANS[0]!;
}

export function resolvePlanLimits(
  planId: string | null | undefined,
  grants: readonly EntitlementGrant[] = [],
): ScalePlanLimits {
  const base = getScalePlan(planId).limits;
  const activeGrants = grants.filter(isActiveGrant);
  const storageBoostBytes = activeGrants.reduce(
    (total, grant) => total + Number(grant.storageBoostBytes ?? 0),
    0,
  );

  return {
    ...base,
    customDomain: base.customDomain || hasActiveGrant(activeGrants, SCALE_FEATURES.CUSTOM_DOMAIN),
    premiumThemes:
      base.premiumThemes || hasActiveGrant(activeGrants, SCALE_FEATURES.PREMIUM_THEMES),
    privacyLevel:
      base.privacyLevel === 'advanced' ||
      hasActiveGrant(activeGrants, SCALE_FEATURES.ADVANCED_PRIVACY)
        ? 'advanced'
        : 'basic',
    storageBytes: base.storageBytes + storageBoostBytes,
    videoSupport: base.videoSupport || hasActiveGrant(activeGrants, SCALE_FEATURES.VIDEO_UPLOADS),
  };
}

export function hasScaleFeatureAccess(
  planId: string | null | undefined,
  featureKey: ScaleFeatureKey,
  grants: readonly EntitlementGrant[] = [],
  enabledFlags: readonly string[] = [],
): boolean {
  if (!enabledFlags.includes(SCALE_FEATURE_FLAGS[featureKey])) {
    return false;
  }

  const limits = resolvePlanLimits(planId, grants);
  if (hasActiveGrant(grants, featureKey)) {
    return true;
  }

  switch (featureKey) {
    case SCALE_FEATURES.ADVANCED_ANALYTICS:
      return limits.analyticsLevel === 'advanced';
    case SCALE_FEATURES.ADVANCED_PRIVACY:
      return limits.privacyLevel === 'advanced';
    case SCALE_FEATURES.CONTEXTUAL_THEMES:
    case SCALE_FEATURES.PREMIUM_THEMES:
      return limits.premiumThemes;
    case SCALE_FEATURES.CUSTOM_DOMAIN:
      return limits.customDomain;
    case SCALE_FEATURES.REVIEW_LINKS:
    case SCALE_FEATURES.STUDIO_BRANDING:
      return limits.studioClients > 0;
    case SCALE_FEATURES.VIDEO_UPLOADS:
      return limits.videoSupport;
    default:
      return false;
  }
}

export function classifyScaleFeature(featureKey: ScaleFeatureKey) {
  switch (featureKey) {
    case SCALE_FEATURES.CUSTOM_DOMAIN:
    case SCALE_FEATURES.PREMIUM_THEMES:
    case SCALE_FEATURES.VIDEO_UPLOADS:
    case SCALE_FEATURES.ADVANCED_ANALYTICS:
    case SCALE_FEATURES.ADVANCED_PRIVACY:
      return 'b2c_package';
    case SCALE_FEATURES.STUDIO_BRANDING:
    case SCALE_FEATURES.REVIEW_LINKS:
      return 'b2b_subscription';
    case SCALE_FEATURES.AI_TAGGING:
    case SCALE_FEATURES.ONLINE_EDITING:
    case SCALE_FEATURES.WATERMARK:
    case SCALE_FEATURES.CONTEXTUAL_THEMES:
    case SCALE_FEATURES.GREETING_AUTOMATION:
      return 'value_added_service';
    default:
      return 'future_placeholder';
  }
}

export function normalizePublicHandle(value: string) {
  const handle = value.trim().replace(/^@/, '').toLowerCase();
  if (!/^[a-z0-9_]{3,24}$/.test(handle)) {
    throw new Error(
      'Handle must be 3-24 characters and use lowercase letters, numbers, or underscore.',
    );
  }
  if (['admin', 'api', 'app', 'auth', 'dashboard', 'login', 'register', 'www'].includes(handle)) {
    throw new Error('Handle is reserved.');
  }
  return handle;
}

export type ContextualThemeInput = {
  date?: Date;
  enabled: boolean;
  holidayKey?: 'tet' | 'valentine' | 'mid_autumn' | 'christmas' | null;
  hour?: number;
  locationAllowed?: boolean;
  reducedMotion?: boolean;
  weather?: 'clear' | 'rain' | 'cloudy' | 'storm' | null;
};

export function resolveContextualTheme(input: ContextualThemeInput) {
  if (!input.enabled) {
    return { effects: 'none', reason: 'disabled', tone: 'default' } as const;
  }

  const date = input.date ?? new Date();
  const month = date.getUTCMonth() + 1;
  const hour = input.hour ?? date.getUTCHours();
  const isNight = hour < 6 || hour >= 18;

  if (input.reducedMotion) {
    return { effects: 'none', reason: 'reduced_motion', tone: isNight ? 'night' : 'day' } as const;
  }
  if (input.holidayKey) {
    return { effects: 'subtle', reason: input.holidayKey, tone: 'festival' } as const;
  }
  if (input.weather === 'rain') {
    return { effects: 'subtle', reason: 'weather_rain', tone: 'soft_rain' } as const;
  }
  if (!input.locationAllowed) {
    return {
      effects: 'none',
      reason: month >= 3 && month <= 8 ? 'season_fallback_warm' : 'season_fallback_calm',
      tone: isNight ? 'night' : 'day',
    } as const;
  }

  return {
    effects: 'subtle',
    reason: isNight ? 'daypart_night' : 'daypart_day',
    tone: isNight ? 'night' : 'day',
  } as const;
}

export type GreetingRuleWindow = {
  customDate?: string | null;
  enabled: boolean;
  month?: number | null;
  day?: number | null;
  triggerType:
    | 'birthday'
    | 'custom'
    | 'proposal_anniversary'
    | 'tet'
    | 'valentine'
    | 'wedding_anniversary';
};

export function isGreetingRuleActive(rule: GreetingRuleWindow, now = new Date()) {
  if (!rule.enabled) return false;
  const month = now.getUTCMonth() + 1;
  const day = now.getUTCDate();

  if (rule.triggerType === 'valentine') return month === 2 && day === 14;
  if (rule.triggerType === 'custom' && rule.customDate) {
    const custom = new Date(rule.customDate);
    return custom.getUTCMonth() + 1 === month && custom.getUTCDate() === day;
  }
  if (rule.month && rule.day) return rule.month === month && rule.day === day;
  return false;
}

function hasActiveGrant(grants: readonly EntitlementGrant[], featureKey: ScaleFeatureKey) {
  return grants.some((grant) => grant.featureKey === featureKey && isActiveGrant(grant));
}

function isActiveGrant(grant: EntitlementGrant) {
  if (!grant.granted) return false;
  if (!grant.expiresAt) return true;
  return new Date(grant.expiresAt).getTime() > Date.now();
}
