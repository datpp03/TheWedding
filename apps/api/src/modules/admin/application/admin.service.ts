import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, type ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';
import {
  AUDIT_LOG_REPOSITORY,
  type AuditLogRepository,
} from '../../audit-logs/domain/audit-log.repository';
import { AuditLogOrmEntity } from '../../audit-logs/infrastructure/audit-log.orm-entity';
import { MediaOrmEntity } from '../../media/infrastructure/media.orm-entity';
import { RoleOrmEntity } from '../../permissions/infrastructure/role.orm-entity';
import {
  DEFAULT_SYSTEM_PARAMETERS,
  SystemParametersService,
  type SystemParameters,
} from '../../settings/application/system-parameters.service';
import { FeatureFlagOrmEntity } from '../../settings/infrastructure/feature-flag.orm-entity';
import { SystemSettingOrmEntity } from '../../settings/infrastructure/system-setting.orm-entity';
import { TenantOrmEntity } from '../../tenants/infrastructure/tenant.orm-entity';
import { UserOrmEntity } from '../../users/infrastructure/user.orm-entity';
import type { AdminListQueryDto, AuditLogQueryDto } from '../presentation/admin.dto';

export type AdminContext = {
  actorUserId: string;
  ipAddress?: string;
  userAgent?: string;
};

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(UserOrmEntity) private readonly users: Repository<UserOrmEntity>,
    @InjectRepository(TenantOrmEntity) private readonly tenants: Repository<TenantOrmEntity>,
    @InjectRepository(MediaOrmEntity) private readonly media: Repository<MediaOrmEntity>,
    @InjectRepository(AuditLogOrmEntity)
    private readonly auditLogsRepo: Repository<AuditLogOrmEntity>,
    @InjectRepository(SystemSettingOrmEntity)
    private readonly settings: Repository<SystemSettingOrmEntity>,
    @InjectRepository(FeatureFlagOrmEntity)
    private readonly featureFlags: Repository<FeatureFlagOrmEntity>,
    @InjectRepository(RoleOrmEntity) private readonly roles: Repository<RoleOrmEntity>,
    private readonly systemParameters: SystemParametersService,
    @Inject(AUDIT_LOG_REPOSITORY) private readonly auditLogs: AuditLogRepository,
  ) {}

  async stats() {
    const [
      usersTotal,
      activeUsers,
      tenantsTotal,
      activeTenants,
      mediaTotal,
      pendingMedia,
      auditEvents,
    ] = await Promise.all([
      this.users.count(),
      this.users.count({ where: { status: 'active' } }),
      this.tenants.count(),
      this.tenants.count({ where: { status: 'active' } }),
      this.media.count(),
      this.media.count({ where: { processingStatus: 'pending' } }),
      this.auditLogsRepo.count(),
    ]);

    return {
      activeTenants,
      activeUsers,
      auditEvents,
      mediaTotal,
      pendingMedia,
      tenantsTotal,
      usersTotal,
    };
  }

  async listUsers(query: AdminListQueryDto) {
    const qb = this.users.createQueryBuilder('user');
    if (query.search) {
      qb.andWhere(
        new Brackets((where) => {
          where
            .where('LOWER(user.email) LIKE :search')
            .orWhere('LOWER(user.displayName) LIKE :search');
        }),
      ).setParameter('search', `%${query.search.toLowerCase()}%`);
    }
    if (query.status) qb.andWhere('user.status = :status', { status: query.status });
    return paginate(qb, query, ['createdAt', 'displayName', 'email', 'status'], 'createdAt');
  }

  async getUser(id: string) {
    const user = await this.users.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return { ...user, roles: await this.getUserRoles(id) };
  }

  async updateUserStatus(id: string, status: string, context: AdminContext) {
    const user = await this.getUser(id);
    await this.users.update(id, { status, updatedAt: new Date() });
    await this.audit(context, 'admin.user_status_updated', 'user', id, {
      from: user.status,
      to: status,
    });
    return this.getUser(id);
  }

  async updateUserRoles(id: string, roleCodes: string[], context: AdminContext) {
    await this.getUser(id);
    const roles = await this.roles
      .createQueryBuilder('role')
      .where('role.code IN (:...roleCodes)', { roleCodes: roleCodes.length ? roleCodes : [''] })
      .getMany();
    if (roles.length !== roleCodes.length) throw new BadRequestException('Unknown role code');
    await this.users.query('DELETE FROM "user_roles" WHERE "userId" = $1', [id]);
    for (const role of roles) {
      await this.users.query(
        'INSERT INTO "user_roles" ("userId", "roleId") VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [id, role.id],
      );
    }
    await this.audit(context, 'admin.user_roles_updated', 'user', id, { roleCodes });
    return this.getUser(id);
  }

  listTenants(query: AdminListQueryDto) {
    const qb = this.tenants.createQueryBuilder('tenant');
    if (query.search) {
      qb.andWhere(
        new Brackets((where) => {
          where
            .where('LOWER(tenant.slug) LIKE :search')
            .orWhere('LOWER(tenant.siteName) LIKE :search')
            .orWhere('LOWER(tenant.customDomain) LIKE :search');
        }),
      ).setParameter('search', `%${query.search.toLowerCase()}%`);
    }
    if (query.status) qb.andWhere('tenant.status = :status', { status: query.status });
    return paginate(qb, query, ['createdAt', 'siteName', 'slug', 'status'], 'createdAt');
  }

  async getTenant(id: string) {
    const tenant = await this.tenants.findOne({ where: { id } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    return tenant;
  }

  async updateTenantStatus(id: string, status: string, context: AdminContext) {
    const tenant = await this.getTenant(id);
    await this.tenants.update(id, { status, updatedAt: new Date() });
    await this.audit(context, 'admin.tenant_status_updated', 'tenant', id, {
      from: tenant.status,
      to: status,
    });
    return this.getTenant(id);
  }

  listMedia(query: AdminListQueryDto) {
    const qb = this.media.createQueryBuilder('media');
    if (query.search) {
      qb.andWhere('LOWER(media.originalFileName) LIKE :search', {
        search: `%${query.search.toLowerCase()}%`,
      });
    }
    if (query.status) {
      qb.andWhere('media.processingStatus = :status', { status: query.status });
    }
    return paginate(
      qb,
      query,
      ['createdAt', 'originalFileName', 'processingStatus', 'sizeBytes'],
      'createdAt',
    );
  }

  async updateMediaStatus(id: string, processingStatus: string, context: AdminContext) {
    const media = await this.media.findOne({ where: { id } });
    if (!media) throw new NotFoundException('Media not found');
    await this.media.update(id, { processingStatus, updatedAt: new Date() });
    await this.audit(context, 'admin.media_moderated', 'media', id, {
      from: media.processingStatus,
      to: processingStatus,
      tenantId: media.tenantId,
    });
    return this.media.findOneByOrFail({ id });
  }

  listAuditLogs(query: AuditLogQueryDto) {
    const qb = this.auditLogsRepo.createQueryBuilder('audit');
    if (query.action) qb.andWhere('audit.action = :action', { action: query.action });
    if (query.entityType)
      qb.andWhere('audit.entityType = :entityType', { entityType: query.entityType });
    if (query.tenantId) qb.andWhere('audit.tenantId = :tenantId', { tenantId: query.tenantId });
    if (query.search) {
      qb.andWhere('LOWER(audit.metadataJson) LIKE :search', {
        search: `%${query.search.toLowerCase()}%`,
      });
    }
    return paginate(qb, query, ['action', 'createdAt', 'entityType'], 'createdAt');
  }

  async getAuditLog(id: string) {
    const log = await this.auditLogsRepo.findOne({ where: { id } });
    if (!log) throw new NotFoundException('Audit log not found');
    return log;
  }

  listSettings() {
    return this.settings.find({ order: { key: 'ASC' } });
  }

  async upsertSetting(
    input: { key: string; valueJson: string; description?: string },
    context: AdminContext,
  ) {
    assertValidJson(input.valueJson);
    let setting = await this.settings.findOne({ where: { key: input.key } });
    setting ??= this.settings.create({ key: input.key, valueJson: input.valueJson });
    setting.valueJson = input.valueJson;
    setting.description = input.description ?? setting.description;
    const saved = await this.settings.save(setting);
    this.systemParameters.invalidate();
    await this.audit(context, 'admin.setting_upserted', 'system_setting', saved.id, {
      key: saved.key,
    });
    return saved;
  }

  listFeatureFlags() {
    return this.featureFlags.find({ order: { key: 'ASC' } });
  }

  async upsertFeatureFlag(
    input: { key: string; enabled: boolean; description?: string; rulesJson?: string },
    context: AdminContext,
  ) {
    if (input.rulesJson) assertValidJson(input.rulesJson);
    let flag = await this.featureFlags.findOne({ where: { key: input.key } });
    flag ??= this.featureFlags.create({ key: input.key });
    flag.enabled = input.enabled;
    flag.description = input.description ?? flag.description;
    flag.rulesJson = input.rulesJson ?? flag.rulesJson;
    const saved = await this.featureFlags.save(flag);
    await this.audit(context, 'admin.feature_flag_upserted', 'feature_flag', saved.id, {
      enabled: saved.enabled,
      key: saved.key,
    });
    return saved;
  }

  getSystemParameters() {
    return this.systemParameters.getParameters();
  }

  async updateSystemParameters(input: Partial<SystemParameters>, context: AdminContext) {
    const saved = await this.systemParameters.updateParameters({
      ...DEFAULT_SYSTEM_PARAMETERS,
      ...input,
    });
    await this.audit(
      context,
      'admin.system_parameters_updated',
      'system_parameters',
      undefined,
      saved,
    );
    return saved;
  }

  private getUserRoles(userId: string): Promise<string[]> {
    return this.users
      .query(
        `SELECT r."code" FROM "user_roles" ur INNER JOIN "roles" r ON r."id" = ur."roleId" WHERE ur."userId" = $1 ORDER BY r."code" ASC`,
        [userId],
      )
      .then((rows: Array<{ code: string }>) => rows.map((row) => row.code));
  }

  private audit(
    context: AdminContext,
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
      userAgent: context.userAgent,
    });
  }
}

async function paginate<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  query: AdminListQueryDto,
  allowedSorts: string[],
  defaultSort: string,
) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  const sortBy = allowedSorts.includes(query.sortBy ?? '') ? query.sortBy : defaultSort;
  const sortOrder = (query.sortOrder ?? 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  const alias = qb.alias;
  const [items, total] = await qb
    .orderBy(`${alias}.${sortBy}`, sortOrder)
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();

  return { items, limit, page, total, totalPages: Math.ceil(total / limit) };
}

function assertValidJson(value: string) {
  try {
    JSON.parse(value);
  } catch {
    throw new BadRequestException('Value must be valid JSON');
  }
}
