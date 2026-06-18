import {
  SCALE_FEATURES,
  SCALE_FEATURE_FLAGS,
  SCALE_PLAN_IDS,
  classifyScaleFeature,
  hasScaleFeatureAccess,
  isGreetingRuleActive,
  normalizePublicHandle,
  resolveContextualTheme,
  resolvePlanLimits,
} from '@the-wedding/shared';

describe('Phase 9 scale foundation', () => {
  it('classifies package, B2B, add-on, and future feature groups', () => {
    expect(classifyScaleFeature(SCALE_FEATURES.PREMIUM_THEMES)).toBe('b2c_package');
    expect(classifyScaleFeature(SCALE_FEATURES.STUDIO_BRANDING)).toBe('b2b_subscription');
    expect(classifyScaleFeature(SCALE_FEATURES.AI_TAGGING)).toBe('value_added_service');
  });

  it('resolves storage boosts from admin entitlements', () => {
    const limits = resolvePlanLimits(SCALE_PLAN_IDS.FREE, [
      {
        granted: true,
        storageBoostBytes: 10 * 1024 * 1024 * 1024,
      },
    ]);

    expect(limits.storageBytes).toBe(11 * 1024 * 1024 * 1024);
  });

  it('requires both plan or entitlement and enabled feature flag for premium themes', () => {
    expect(
      hasScaleFeatureAccess(
        SCALE_PLAN_IDS.FREE,
        SCALE_FEATURES.PREMIUM_THEMES,
        [],
        [SCALE_FEATURE_FLAGS.premium_themes],
      ),
    ).toBe(false);
    expect(
      hasScaleFeatureAccess(
        SCALE_PLAN_IDS.FREE,
        SCALE_FEATURES.PREMIUM_THEMES,
        [{ featureKey: SCALE_FEATURES.PREMIUM_THEMES, granted: true }],
        [SCALE_FEATURE_FLAGS.premium_themes],
      ),
    ).toBe(true);
    expect(
      hasScaleFeatureAccess(SCALE_PLAN_IDS.COUPLE_PREMIUM, SCALE_FEATURES.PREMIUM_THEMES, [], []),
    ).toBe(false);
  });

  it('normalizes public handles and rejects reserved handles', () => {
    expect(normalizePublicHandle('@Minh_An')).toBe('minh_an');
    expect(() => normalizePublicHandle('admin')).toThrow('reserved');
  });

  it('falls back safely for contextual themes without location/weather permission', () => {
    const resolved = resolveContextualTheme({
      date: new Date('2026-06-18T12:00:00Z'),
      enabled: true,
      locationAllowed: false,
    });

    expect(resolved.effects).toBe('none');
    expect(resolved.reason).toBe('season_fallback_warm');
  });

  it('validates greeting schedule windows', () => {
    expect(
      isGreetingRuleActive(
        { enabled: true, triggerType: 'wedding_anniversary', month: 6, day: 18 },
        new Date('2026-06-18T01:00:00Z'),
      ),
    ).toBe(true);
    expect(
      isGreetingRuleActive(
        { enabled: false, triggerType: 'valentine' },
        new Date('2026-02-14T01:00:00Z'),
      ),
    ).toBe(false);
  });
});
