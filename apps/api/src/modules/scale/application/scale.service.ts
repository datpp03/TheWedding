import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  MEDIA_TYPE,
  SCALE_ADD_ONS,
  SCALE_FEATURE_FLAGS,
  SCALE_FEATURES,
  SCALE_PLANS,
  getScalePlan,
  hasScaleFeatureAccess,
  normalizePublicHandle,
  resolvePlanLimits,
  type EntitlementGrant,
  type ScaleFeatureKey,
} from '@the-wedding/shared';
import { Repository } from 'typeorm';
import {
  AUDIT_LOG_REPOSITORY,
  type AuditLogRepository,
} from '../../audit-logs/domain/audit-log.repository';
import { AlbumOrmEntity } from '../../albums/infrastructure/album.orm-entity';
import { MediaOrmEntity } from '../../media/infrastructure/media.orm-entity';
import { FeatureFlagOrmEntity } from '../../settings/infrastructure/feature-flag.orm-entity';
import { TenantOrmEntity } from '../../tenants/infrastructure/tenant.orm-entity';
import type { AuthenticatedUser } from '../../../common/types/authenticated-user';
import type {
  CreateGreetingRuleDto,
  GrantEntitlementDto,
  RecordAnalyticsEventDto,
  RecordPaymentEventDto,
} from '../presentation/scale.dto';
import { AnalyticsEventOrmEntity } from '../infrastructure/analytics-event.orm-entity';
import { CustomDomainOrmEntity } from '../infrastructure/custom-domain.orm-entity';
import { EntitlementOrmEntity } from '../infrastructure/entitlement.orm-entity';
import { GreetingRuleOrmEntity } from '../infrastructure/greeting-rule.orm-entity';
import { PaymentEventOrmEntity } from '../infrastructure/payment-event.orm-entity';
import { PlanSubscriptionOrmEntity } from '../infrastructure/plan-subscription.orm-entity';
import { StudioClientOrmEntity } from '../infrastructure/studio-client.orm-entity';
import { StudioProfileOrmEntity } from '../infrastructure/studio-profile.orm-entity';
import { UserPublicHandleOrmEntity } from '../infrastructure/user-public-handle.orm-entity';

export type ScaleContext = {
  actorUserId: string;
  ipAddress?: string;
  userAgent?: string | string[];
};

export type TenantUploadPolicy = Awaited<ReturnType<ScaleService['getTenantUploadPolicy']>>;

@Injectable()
export class ScaleService {
  constructor(
    @InjectRepository(UserPublicHandleOrmEntity)
    private readonly handles: Repository<UserPublicHandleOrmEntity>,
    @InjectRepository(PlanSubscriptionOrmEntity)
    private readonly subscriptions: Repository<PlanSubscriptionOrmEntity>,
    @InjectRepository(EntitlementOrmEntity)
    private readonly entitlements: Repository<EntitlementOrmEntity>,
    @InjectRepository(PaymentEventOrmEntity)
    private readonly paymentEvents: Repository<PaymentEventOrmEntity>,
    @InjectRepository(CustomDomainOrmEntity)
    private readonly customDomains: Repository<CustomDomainOrmEntity>,
    @InjectRepository(StudioProfileOrmEntity)
    private readonly studioProfiles: Repository<StudioProfileOrmEntity>,
    @InjectRepository(StudioClientOrmEntity)
    private readonly studioClients: Repository<StudioClientOrmEntity>,
    @InjectRepository(AnalyticsEventOrmEntity)
    private readonly analyticsEvents: Repository<AnalyticsEventOrmEntity>,
    @InjectRepository(GreetingRuleOrmEntity)
    private readonly greetingRules: Repository<GreetingRuleOrmEntity>,
    @InjectRepository(TenantOrmEntity) private readonly tenants: Repository<TenantOrmEntity>,
    @InjectRepository(AlbumOrmEntity) private readonly albums: Repository<AlbumOrmEntity>,
    @InjectRepository(MediaOrmEntity) private readonly media: Repository<MediaOrmEntity>,
    @InjectRepository(FeatureFlagOrmEntity)
    private readonly featureFlags: Repository<FeatureFlagOrmEntity>,
    @Inject(AUDIT_LOG_REPOSITORY) private readonly auditLogs: AuditLogRepository,
  ) {}

  getCatalog() {
    return {
      addOns: SCALE_ADD_ONS,
      featureFlags: SCALE_FEATURE_FLAGS,
      plans: SCALE_PLANS,
    };
  }

  async checkHandleAvailability(value: string, userId?: string) {
    const handle = normalizeHandleOrThrow(value);
    const existing = await this.handles.findOne({ where: { handle } });
    return {
      available: !existing || existing.userId === userId,
      handle,
    };
  }

  async getMyProfile(user: AuthenticatedUser) {
    const handle = await this.handles.findOne({ where: { userId: user.id } });
    const tenantSummaries = await Promise.all(
      user.tenantIds.map((tenantId) => this.getTenantScaleSummary(tenantId, user)),
    );
    return {
      handle: handle?.handle ?? null,
      tenantSummaries,
    };
  }

  async updateMyHandle(value: string, context: ScaleContext) {
    const handle = normalizeHandleOrThrow(value);
    const existing = await this.handles.findOne({ where: { handle } });
    if (existing && existing.userId !== context.actorUserId) {
      throw new ConflictException('Handle is already in use');
    }

    let row = await this.handles.findOne({ where: { userId: context.actorUserId } });
    row ??= this.handles.create({ userId: context.actorUserId });
    row.handle = handle;
    const saved = await this.handles.save(row);
    await this.audit(context, 'scale.user_handle_updated', 'user_public_handle', saved.id, {
      handle,
    });
    return saved;
  }

  async getTenantScaleSummary(tenantId: string, user: AuthenticatedUser) {
    if (!user.tenantIds.includes(tenantId)) {
      throw new ForbiddenException('Tenant access denied');
    }

    const tenant = await this.tenants.findOne({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');

    const [policy, ownerHandle] = await Promise.all([
      this.getTenantUploadPolicy(tenantId, user.id),
      this.handles.findOne({ where: { userId: tenant.ownerUserId } }),
    ]);

    return {
      canonicalAlbumUrlTemplate: ownerHandle
        ? `/@${ownerHandle.handle}/${tenant.slug}/albums/{albumSlugOrShortId}`
        : null,
      enabledFeatures: policy.enabledFeatures,
      limits: policy.limits,
      plan: policy.plan,
      storage: policy.usage,
      tenantId,
      tenantSlug: tenant.slug,
    };
  }

  async getTenantUploadPolicy(tenantId: string, userId: string) {
    const [subscription, tenantEntitlements, userEntitlements, usage, flags] = await Promise.all([
      this.findActiveSubscription(tenantId, userId),
      this.entitlements.find({ where: { subjectId: tenantId, subjectType: 'tenant' } }),
      this.entitlements.find({ where: { subjectId: userId, subjectType: 'user' } }),
      this.getTenantUsage(tenantId),
      this.listEnabledFeatureFlags(),
    ]);
    const grants = toEntitlementGrants([...tenantEntitlements, ...userEntitlements]);
    const plan = getScalePlan(subscription?.planId);
    const limits = resolvePlanLimits(plan.id, grants);
    const enabledFeatures = Object.keys(SCALE_FEATURE_FLAGS).filter((featureKey) =>
      hasScaleFeatureAccess(plan.id, featureKey as ScaleFeatureKey, grants, flags),
    );

    return {
      enabledFeatures,
      limits,
      plan,
      usage,
      videoUploadEnabled: hasScaleFeatureAccess(
        plan.id,
        SCALE_FEATURES.VIDEO_UPLOADS,
        grants,
        flags,
      ),
    };
  }

  async grantEntitlement(input: GrantEntitlementDto, context: ScaleContext) {
    if (!input.featureKey && !input.storageBoostBytes) {
      throw new BadRequestException('Feature key or storage boost is required');
    }

    const saved = await this.entitlements.save(
      this.entitlements.create({
        expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
        featureKey: input.featureKey ?? null,
        granted: input.granted ?? true,
        grantedByUserId: context.actorUserId,
        reason: input.reason?.trim() || null,
        startsAt: new Date(),
        storageBoostBytes: input.storageBoostBytes ?? '0',
        subjectId: input.subjectId,
        subjectType: input.subjectType,
      }),
    );
    await this.audit(context, 'scale.entitlement_granted', 'entitlement', saved.id, {
      featureKey: saved.featureKey,
      granted: saved.granted,
      storageBoostBytes: saved.storageBoostBytes,
      subjectId: saved.subjectId,
      subjectType: saved.subjectType,
    });
    return saved;
  }

  async recordPaymentEvent(input: RecordPaymentEventDto, context: ScaleContext) {
    const existing = await this.paymentEvents.findOne({
      where: { provider: input.provider, providerEventId: input.providerEventId },
    });
    if (existing) {
      return { duplicate: true, event: existing };
    }

    const saved = await this.paymentEvents.save(
      this.paymentEvents.create({
        amount: input.amount ?? null,
        currency: input.currency ?? 'VND',
        eventType: input.eventType,
        metadataJson: input.metadata ? JSON.stringify(input.metadata) : null,
        processedAt: new Date(),
        provider: input.provider,
        providerEventId: input.providerEventId,
        status: input.status,
      }),
    );
    await this.audit(context, 'scale.payment_event_recorded', 'payment_event', saved.id, {
      provider: saved.provider,
      providerEventId: saved.providerEventId,
      status: saved.status,
    });
    return { duplicate: false, event: saved };
  }

  async recordAnalyticsEvent(input: RecordAnalyticsEventDto, user?: AuthenticatedUser) {
    const tenant = await this.tenants.findOne({ where: { id: input.tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');

    if (input.albumId) {
      const album = await this.albums.findOne({
        where: { id: input.albumId, tenantId: tenant.id },
      });
      if (!album) throw new NotFoundException('Album not found');
      const canRecord =
        album.visibility === 'public' || Boolean(user?.tenantIds.includes(input.tenantId));
      if (!canRecord) throw new ForbiddenException('Analytics event is not allowed');
    }

    return this.analyticsEvents.save(
      this.analyticsEvents.create({
        actorUserId: user?.id ?? null,
        albumId: input.albumId ?? null,
        eventType: input.eventType,
        mediaId: input.mediaId ?? null,
        metadataJson: input.metadata ? JSON.stringify(input.metadata) : null,
        tenantId: input.tenantId,
      }),
    );
  }

  async createGreetingRule(input: CreateGreetingRuleDto, context: ScaleContext) {
    if (input.scopeType !== 'global' && !input.scopeId) {
      throw new BadRequestException('Tenant or user scoped greeting rules require scopeId');
    }
    if (
      input.triggerType !== 'valentine' &&
      input.triggerType !== 'tet' &&
      input.triggerType !== 'custom' &&
      (!input.dateMonth || !input.dateDay)
    ) {
      throw new BadRequestException('Scheduled greeting rules require dateMonth and dateDay');
    }

    const saved = await this.greetingRules.save(
      this.greetingRules.create({
        createdByUserId: context.actorUserId,
        customDate: input.customDate ?? null,
        dateDay: input.dateDay ?? null,
        dateMonth: input.dateMonth ?? null,
        enabled: input.enabled ?? false,
        locale: input.locale,
        scopeId: input.scopeId ?? null,
        scopeType: input.scopeType,
        templateKey: input.templateKey,
        triggerType: input.triggerType,
      }),
    );
    await this.audit(context, 'scale.greeting_rule_created', 'greeting_rule', saved.id, {
      scopeType: saved.scopeType,
      triggerType: saved.triggerType,
    });
    return saved;
  }

  async getAdminOverview() {
    const [
      subscriptions,
      entitlements,
      paymentEvents,
      customDomains,
      studioProfiles,
      studioClients,
      analyticsEvents,
      greetingRules,
    ] = await Promise.all([
      this.subscriptions.count(),
      this.entitlements.count(),
      this.paymentEvents.count(),
      this.customDomains.count(),
      this.studioProfiles.count(),
      this.studioClients.count(),
      this.analyticsEvents.count(),
      this.greetingRules.count(),
    ]);

    return {
      analyticsEvents,
      catalog: this.getCatalog(),
      customDomains,
      entitlements,
      greetingRules,
      paymentEvents,
      studioClients,
      studioProfiles,
      subscriptions,
    };
  }

  private async getTenantUsage(tenantId: string) {
    const [mediaCount, photoCount, videoCount, raw] = await Promise.all([
      this.media.count({ where: { tenantId } }),
      this.media.count({ where: { tenantId, type: MEDIA_TYPE.IMAGE } }),
      this.media.count({ where: { tenantId, type: MEDIA_TYPE.VIDEO } }),
      this.media
        .createQueryBuilder('media')
        .select('COALESCE(SUM(CAST(media."sizeBytes" AS bigint)), 0)', 'bytes')
        .where('media."tenantId" = :tenantId', { tenantId })
        .getRawOne<{ bytes: string }>(),
    ]);
    return {
      mediaCount,
      photoCount,
      storageBytes: Number(raw?.bytes ?? 0),
      videoCount,
    };
  }

  private async listEnabledFeatureFlags() {
    const flags = await this.featureFlags.find({ where: { enabled: true } });
    return flags.map((flag) => flag.key);
  }

  private async findActiveSubscription(tenantId: string, userId: string) {
    const [tenantSubscription, userSubscription] = await Promise.all([
      this.subscriptions.findOne({
        order: { createdAt: 'DESC' },
        where: { status: 'active', tenantId },
      }),
      this.subscriptions.findOne({
        order: { createdAt: 'DESC' },
        where: { status: 'active', userId },
      }),
    ]);
    return tenantSubscription ?? userSubscription ?? null;
  }

  private audit(
    context: ScaleContext,
    action: string,
    entityType: string,
    entityId?: string,
    metadata?: Record<string, unknown>,
  ) {
    return this.auditLogs.append({
      action,
      actorUserId: context.actorUserId,
      entityId,
      entityType,
      ipAddress: context.ipAddress,
      metadata,
      userAgent: Array.isArray(context.userAgent)
        ? context.userAgent.join(', ')
        : context.userAgent,
    });
  }
}

function normalizeHandleOrThrow(value: string) {
  try {
    return normalizePublicHandle(value);
  } catch (error) {
    throw new BadRequestException(error instanceof Error ? error.message : 'Invalid handle');
  }
}

function toEntitlementGrants(rows: EntitlementOrmEntity[]): EntitlementGrant[] {
  return rows.map((row) => ({
    expiresAt: row.expiresAt,
    featureKey: row.featureKey as ScaleFeatureKey | null,
    granted: row.granted,
    storageBoostBytes: Number(row.storageBoostBytes),
  }));
}
