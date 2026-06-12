import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { WeddingTheme } from '@the-wedding/shared';
import { Repository } from 'typeorm';
import type {
  CreateTenantInput,
  TenantRepository,
  UpdateTenantInput,
} from '../domain/tenant.repository';
import type { TenantSeo, TenantSettings, TenantSharing, TenantView } from '../domain/tenant';
import { ThemeOrmEntity } from '../../themes/infrastructure/theme.orm-entity';
import { toView as themeToView } from '../../themes/infrastructure/typeorm-theme.repository';
import { TenantMemberOrmEntity } from './tenant-member.orm-entity';
import { TenantOrmEntity } from './tenant.orm-entity';

@Injectable()
export class TypeOrmTenantRepository implements TenantRepository {
  constructor(
    @InjectRepository(TenantOrmEntity)
    private readonly tenants: Repository<TenantOrmEntity>,
    @InjectRepository(TenantMemberOrmEntity)
    private readonly members: Repository<TenantMemberOrmEntity>,
    @InjectRepository(ThemeOrmEntity)
    private readonly themes: Repository<ThemeOrmEntity>,
  ) {}

  async create(input: CreateTenantInput): Promise<TenantView> {
    const tenant = this.tenants.create({
      ownerUserId: input.ownerUserId,
      slug: input.slug,
      siteName: input.siteName,
      brideName: input.brideName ?? null,
      groomName: input.groomName ?? null,
      weddingDate: input.weddingDate ?? null,
      description: input.description ?? null,
      visibility: input.visibility ?? 'private',
      passwordHash: input.passwordHash ?? null,
      customDomain: null,
      status: 'active',
      settingsJson: stringify(input.settings),
      seoJson: stringify(input.seo),
      sharingJson: stringify(input.sharing),
    });
    const saved = await this.tenants.save(tenant);

    await this.members.save(
      this.members.create({
        tenantId: saved.id,
        userId: input.ownerUserId,
        role: 'owner',
      }),
    );

    return toView(saved);
  }

  async listForUser(userId: string): Promise<TenantView[]> {
    const rows = await this.tenants
      .createQueryBuilder('tenant')
      .innerJoin(TenantMemberOrmEntity, 'member', 'member.tenantId = tenant.id')
      .where('member.userId = :userId', { userId })
      .andWhere('tenant.deletedAt IS NULL')
      .orderBy('tenant.createdAt', 'DESC')
      .getMany();

    return rows.map(toView);
  }

  async findByIdForUser(tenantId: string, userId: string): Promise<TenantView | null> {
    const tenant = await this.tenants
      .createQueryBuilder('tenant')
      .innerJoin(TenantMemberOrmEntity, 'member', 'member.tenantId = tenant.id')
      .where('tenant.id = :tenantId', { tenantId })
      .andWhere('member.userId = :userId', { userId })
      .andWhere('tenant.deletedAt IS NULL')
      .getOne();

    return tenant ? toView(tenant) : null;
  }

  async findPublicBySlug(
    slug: string,
  ): Promise<
    (TenantView & { activeTheme?: WeddingTheme | null; passwordHash: string | null }) | null
  > {
    const tenant = await this.tenants.findOne({
      where: {
        slug,
      },
    });

    if (!tenant || tenant.deletedAt) {
      return null;
    }

    const activeTheme = await this.themes.findOne({
      order: { updatedAt: 'DESC' },
      where: { isActive: true, tenantId: tenant.id },
    });

    return {
      ...toView(tenant),
      activeTheme: activeTheme ? themeToView(activeTheme) : null,
      passwordHash: tenant.passwordHash,
    };
  }

  async isSlugAvailable(slug: string, excludeTenantId?: string): Promise<boolean> {
    const query = this.tenants
      .createQueryBuilder('tenant')
      .where('tenant.slug = :slug', { slug })
      .andWhere('tenant.deletedAt IS NULL');

    if (excludeTenantId) {
      query.andWhere('tenant.id != :excludeTenantId', { excludeTenantId });
    }

    return (await query.getCount()) === 0;
  }

  async update(tenantId: string, input: UpdateTenantInput): Promise<TenantView | null> {
    const tenant = await this.tenants.findOne({ where: { id: tenantId } });

    if (!tenant || tenant.deletedAt) {
      return null;
    }

    Object.assign(tenant, {
      ...pickDefined({
        brideName: input.brideName,
        description: input.description,
        groomName: input.groomName,
        passwordHash: input.passwordHash,
        siteName: input.siteName,
        slug: input.slug,
        visibility: input.visibility,
        weddingDate: input.weddingDate,
      }),
      ...(input.settings === undefined ? {} : { settingsJson: stringify(input.settings) }),
      ...(input.seo === undefined ? {} : { seoJson: stringify(input.seo) }),
      ...(input.sharing === undefined ? {} : { sharingJson: stringify(input.sharing) }),
      updatedAt: new Date(),
    });

    return toView(await this.tenants.save(tenant));
  }

  async softDelete(tenantId: string): Promise<void> {
    await this.tenants.softDelete(tenantId);
  }
}

function toView(entity: TenantOrmEntity): TenantView {
  return {
    id: entity.id,
    ownerUserId: entity.ownerUserId,
    slug: entity.slug,
    siteName: entity.siteName,
    brideName: entity.brideName,
    groomName: entity.groomName,
    weddingDate: entity.weddingDate,
    description: entity.description,
    visibility: entity.visibility as TenantView['visibility'],
    customDomain: entity.customDomain,
    status: entity.status,
    settings: parseJson<TenantSettings>(entity.settingsJson),
    seo: parseJson<TenantSeo>(entity.seoJson),
    sharing: parseJson<TenantSharing>(entity.sharingJson),
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}

function stringify(value: unknown) {
  return value ? JSON.stringify(value) : null;
}

function parseJson<TValue extends object>(value: string | null): TValue {
  if (!value) {
    return {} as TValue;
  }

  try {
    return JSON.parse(value) as TValue;
  } catch {
    return {} as TValue;
  }
}

function pickDefined<TValue extends Record<string, unknown>>(value: TValue) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entryValue]) => entryValue !== undefined),
  ) as Partial<TValue>;
}
