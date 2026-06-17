import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { redactSensitiveMetadata } from '../../../common/security/audit-redaction';
import type { AuditLogInput, AuditLogRepository } from '../domain/audit-log.repository';
import { AuditLogOrmEntity } from './audit-log.orm-entity';

@Injectable()
export class TypeOrmAuditLogRepository implements AuditLogRepository {
  constructor(
    @InjectRepository(AuditLogOrmEntity)
    private readonly auditLogs: Repository<AuditLogOrmEntity>,
  ) {}

  async append(input: AuditLogInput): Promise<void> {
    const auditLog = this.auditLogs.create({
      actorUserId: input.actorUserId ?? null,
      tenantId: input.tenantId ?? null,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId ?? null,
      metadataJson: input.metadata ? JSON.stringify(redactSensitiveMetadata(input.metadata)) : null,
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
    });

    await this.auditLogs.save(auditLog);
  }
}
