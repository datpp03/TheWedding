import {
  DEFAULT_THEME_PRESET_ID,
  normalizeTheme,
  type ThemeConfig,
  type WeddingTheme,
} from '@the-wedding/shared';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  CreateThemeInput,
  ThemeRepository,
  UpdateThemeInput,
} from '../domain/theme.repository';
import { ThemeOrmEntity } from './theme.orm-entity';

@Injectable()
export class TypeOrmThemeRepository implements ThemeRepository {
  constructor(
    @InjectRepository(ThemeOrmEntity)
    private readonly themes: Repository<ThemeOrmEntity>,
  ) {}

  async listByTenant(tenantId: string): Promise<WeddingTheme[]> {
    const rows = await this.themes.find({
      order: { isActive: 'DESC', updatedAt: 'DESC' },
      where: { tenantId },
    });

    return rows.map(toView);
  }

  async findActive(tenantId: string): Promise<WeddingTheme | null> {
    const theme = await this.themes.findOne({
      order: { updatedAt: 'DESC' },
      where: { isActive: true, tenantId },
    });

    return theme ? toView(theme) : null;
  }

  async findById(tenantId: string, themeId: string): Promise<WeddingTheme | null> {
    const theme = await this.themes.findOne({ where: { id: themeId, tenantId } });
    return theme ? toView(theme) : null;
  }

  async create(input: CreateThemeInput): Promise<WeddingTheme> {
    if (input.isActive) {
      await this.themes.update({ tenantId: input.tenantId }, { isActive: false });
    }

    const theme = await this.themes.save(this.themes.create(toEntity(input)));
    return toView(theme);
  }

  async update(
    tenantId: string,
    themeId: string,
    input: UpdateThemeInput,
  ): Promise<WeddingTheme | null> {
    const existing = await this.themes.findOne({ where: { id: themeId, tenantId } });

    if (!existing) {
      return null;
    }

    Object.assign(existing, toEntity({ ...toView(existing), ...input, tenantId }));
    existing.updatedAt = new Date();

    return toView(await this.themes.save(existing));
  }

  async activate(tenantId: string, themeId: string): Promise<WeddingTheme | null> {
    const existing = await this.themes.findOne({ where: { id: themeId, tenantId } });

    if (!existing) {
      return null;
    }

    await this.themes.update({ tenantId }, { isActive: false });
    existing.isActive = true;
    existing.updatedAt = new Date();

    return toView(await this.themes.save(existing));
  }

  async deleteForTenant(tenantId: string): Promise<void> {
    await this.themes.delete({ tenantId });
  }
}

export function toView(entity: ThemeOrmEntity): WeddingTheme {
  const config = parseJson<
    ThemeConfig & {
      bodyFont?: string;
      bodyWeight?: number;
      headingWeight?: number;
      muted?: string;
      presetId?: string;
      styleType?: string;
      surface?: string;
    }
  >(entity.configJson);
  return normalizeTheme({
    id: entity.id,
    tenantId: entity.tenantId,
    presetId: config.presetId ?? DEFAULT_THEME_PRESET_ID,
    name: entity.name,
    colors: {
      primary: entity.primaryColor,
      secondary: entity.secondaryColor,
      background: entity.backgroundColor,
      surface: config.surface ?? entity.backgroundColor,
      text: entity.textColor,
      muted: config.muted ?? entity.textColor,
    },
    typography: {
      headingFont: entity.fontFamily,
      bodyFont: config.bodyFont ?? entity.fontFamily,
      headingWeight: config.headingWeight ?? 700,
      bodyWeight: config.bodyWeight ?? 400,
    },
    layoutType: entity.layoutType as WeddingTheme['layoutType'],
    styleType: config.styleType as WeddingTheme['styleType'],
    animationType: (entity.animationType ?? 'none') as WeddingTheme['animationType'],
    config: {
      borderRadius: config.borderRadius ?? 8,
      heroStyle: config.heroStyle ?? 'centered',
      mediaDensity: config.mediaDensity ?? 'balanced',
      overlayOpacity: config.overlayOpacity ?? 0.16,
    },
    customCss: entity.customCss,
    isActive: entity.isActive,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  });
}

function toEntity(themeInput: CreateThemeInput | (WeddingTheme & { tenantId: string })) {
  const theme = normalizeTheme(themeInput);
  return {
    tenantId: themeInput.tenantId,
    name: theme.name,
    primaryColor: theme.colors.primary,
    secondaryColor: theme.colors.secondary,
    backgroundColor: theme.colors.background,
    textColor: theme.colors.text,
    fontFamily: theme.typography.headingFont,
    layoutType: theme.layoutType,
    animationType: theme.animationType,
    customCss: theme.customCss ?? null,
    configJson: JSON.stringify({
      ...theme.config,
      bodyFont: theme.typography.bodyFont,
      bodyWeight: theme.typography.bodyWeight,
      headingWeight: theme.typography.headingWeight,
      muted: theme.colors.muted,
      presetId: theme.presetId,
      styleType: theme.styleType,
      surface: theme.colors.surface,
    }),
    isActive: 'isActive' in themeInput ? Boolean(themeInput.isActive) : false,
  };
}

function parseJson<TValue extends object>(value: string | null): Partial<TValue> {
  if (!value) {
    return {};
  }

  try {
    return JSON.parse(value) as Partial<TValue>;
  } catch {
    return {};
  }
}
