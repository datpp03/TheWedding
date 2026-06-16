import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { AuditLogOrmEntity } from '../audit-logs/infrastructure/audit-log.orm-entity';
import { MediaOrmEntity } from '../media/infrastructure/media.orm-entity';
import { RoleOrmEntity } from '../permissions/infrastructure/role.orm-entity';
import { SettingsModule } from '../settings/settings.module';
import { FeatureFlagOrmEntity } from '../settings/infrastructure/feature-flag.orm-entity';
import { SystemSettingOrmEntity } from '../settings/infrastructure/system-setting.orm-entity';
import { TenantOrmEntity } from '../tenants/infrastructure/tenant.orm-entity';
import { UserOrmEntity } from '../users/infrastructure/user.orm-entity';
import { AdminService } from './application/admin.service';
import { AdminController } from './presentation/admin.controller';

@Module({
  imports: [
    AuditLogsModule,
    SettingsModule,
    TypeOrmModule.forFeature([
      AuditLogOrmEntity,
      FeatureFlagOrmEntity,
      MediaOrmEntity,
      RoleOrmEntity,
      SystemSettingOrmEntity,
      TenantOrmEntity,
      UserOrmEntity,
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
