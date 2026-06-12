import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AUDIT_LOG_REPOSITORY } from './domain/audit-log.repository';
import { AuditLogOrmEntity } from './infrastructure/audit-log.orm-entity';
import { TypeOrmAuditLogRepository } from './infrastructure/typeorm-audit-log.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLogOrmEntity])],
  providers: [
    {
      provide: AUDIT_LOG_REPOSITORY,
      useClass: TypeOrmAuditLogRepository,
    },
  ],
  exports: [AUDIT_LOG_REPOSITORY],
})
export class AuditLogsModule {}
