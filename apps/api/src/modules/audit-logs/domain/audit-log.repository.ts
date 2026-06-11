export const AUDIT_LOG_REPOSITORY = Symbol('AUDIT_LOG_REPOSITORY');

export type AuditLogInput = {
  actorUserId?: string;
  tenantId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
};

export interface AuditLogRepository {
  append(input: AuditLogInput): Promise<void>;
}
