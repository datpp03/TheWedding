import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  DEFAULT_THEME_PRESET_ID,
  THEME_PRESETS,
  createThemeFromPreset,
  normalizeTheme,
  validateTheme,
  type WeddingTheme,
} from '@the-wedding/shared';
import {
  AUDIT_LOG_REPOSITORY,
  type AuditLogRepository,
} from '../../audit-logs/domain/audit-log.repository';
import {
  TenantsService,
  type TenantMutationContext,
} from '../../tenants/application/tenants.service';
import { THEME_REPOSITORY, type ThemeRepository } from '../domain/theme.repository';

@Injectable()
export class ThemesService {
  constructor(
    @Inject(THEME_REPOSITORY)
    private readonly themes: ThemeRepository,
    @Inject(AUDIT_LOG_REPOSITORY)
    private readonly auditLogs: AuditLogRepository,
    private readonly tenants: TenantsService,
  ) {}

  presets() {
    return THEME_PRESETS;
  }

  async list(tenantId: string, context: TenantMutationContext) {
    await this.assertTenantAccess(tenantId, context.actorUserId);
    const themes = await this.themes.listByTenant(tenantId);

    if (themes.length) {
      return themes;
    }

    return [await this.createDefaultTheme(tenantId)];
  }

  async active(tenantId: string, context: TenantMutationContext) {
    await this.assertTenantAccess(tenantId, context.actorUserId);
    return this.findOrCreateActive(tenantId);
  }

  preview(input: Partial<WeddingTheme>) {
    return this.validateAndNormalize(input);
  }

  async create(
    tenantId: string,
    input: Partial<WeddingTheme> & { activate?: boolean },
    context: TenantMutationContext,
  ) {
    await this.assertTenantAccess(tenantId, context.actorUserId);
    const theme = await this.themes.create({
      ...this.validateAndNormalize(input),
      tenantId,
      isActive: input.activate ?? false,
    });

    await this.auditLogs.append({
      actorUserId: context.actorUserId,
      tenantId,
      action: input.activate ? 'theme.created_activated' : 'theme.created',
      entityType: 'theme',
      entityId: theme.id,
      metadata: { presetId: theme.presetId },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
    });

    return theme;
  }

  async update(
    tenantId: string,
    themeId: string,
    input: Partial<WeddingTheme>,
    context: TenantMutationContext,
  ) {
    await this.assertTenantAccess(tenantId, context.actorUserId);
    const current = await this.themes.findById(tenantId, themeId);

    if (!current) {
      throw new NotFoundException('Theme not found');
    }

    const theme = await this.themes.update(
      tenantId,
      themeId,
      this.validateAndNormalize({ ...current, ...input }),
    );

    if (!theme) {
      throw new NotFoundException('Theme not found');
    }

    await this.auditLogs.append({
      actorUserId: context.actorUserId,
      tenantId,
      action: 'theme.updated',
      entityType: 'theme',
      entityId: themeId,
      metadata: { fields: Object.keys(input) },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
    });

    return theme;
  }

  async activate(tenantId: string, themeId: string, context: TenantMutationContext) {
    await this.assertTenantAccess(tenantId, context.actorUserId);
    const theme = await this.themes.activate(tenantId, themeId);

    if (!theme) {
      throw new NotFoundException('Theme not found');
    }

    await this.auditLogs.append({
      actorUserId: context.actorUserId,
      tenantId,
      action: 'theme.activated',
      entityType: 'theme',
      entityId: themeId,
      metadata: { presetId: theme.presetId },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
    });

    return theme;
  }

  async clone(tenantId: string, themeId: string, context: TenantMutationContext) {
    await this.assertTenantAccess(tenantId, context.actorUserId);
    const current = await this.themes.findById(tenantId, themeId);

    if (!current) {
      throw new NotFoundException('Theme not found');
    }

    const theme = await this.themes.create({
      ...this.validateAndNormalize({ ...current, name: `${current.name} Copy` }),
      tenantId,
      isActive: false,
    });

    await this.auditLogs.append({
      actorUserId: context.actorUserId,
      tenantId,
      action: 'theme.cloned',
      entityType: 'theme',
      entityId: theme.id,
      metadata: { sourceThemeId: themeId },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
    });

    return theme;
  }

  async reset(
    tenantId: string,
    context: TenantMutationContext,
    presetId = DEFAULT_THEME_PRESET_ID,
  ) {
    await this.assertTenantAccess(tenantId, context.actorUserId);
    await this.themes.deleteForTenant(tenantId);
    const theme = await this.createDefaultTheme(tenantId, presetId);

    await this.auditLogs.append({
      actorUserId: context.actorUserId,
      tenantId,
      action: 'theme.reset',
      entityType: 'theme',
      entityId: theme.id,
      metadata: { presetId },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
    });

    return theme;
  }

  async findOrCreateActive(tenantId: string) {
    return (await this.themes.findActive(tenantId)) ?? this.createDefaultTheme(tenantId);
  }

  private async assertTenantAccess(tenantId: string, userId: string) {
    await this.tenants.get(tenantId, userId);
  }

  private createDefaultTheme(tenantId: string, presetId = DEFAULT_THEME_PRESET_ID) {
    return this.themes.create({
      ...createThemeFromPreset(presetId),
      tenantId,
      isActive: true,
    });
  }

  private validateAndNormalize(input: Partial<WeddingTheme>) {
    const errors = validateTheme(input);

    if (errors.length) {
      throw new BadRequestException(errors.join(' '));
    }

    return normalizeTheme(input);
  }
}
