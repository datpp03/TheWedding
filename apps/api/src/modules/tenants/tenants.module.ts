import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { Argon2PasswordHasher } from '../auth/infrastructure/argon2-password-hasher';
import { ThemeOrmEntity } from '../themes/infrastructure/theme.orm-entity';
import { TenantsService } from './application/tenants.service';
import { TENANT_REPOSITORY } from './domain/tenant.repository';
import { TenantMemberOrmEntity } from './infrastructure/tenant-member.orm-entity';
import { TenantOrmEntity } from './infrastructure/tenant.orm-entity';
import { TypeOrmTenantRepository } from './infrastructure/typeorm-tenant.repository';
import { TenantsController } from './presentation/tenants.controller';

@Module({
  imports: [
    AuditLogsModule,
    TypeOrmModule.forFeature([TenantOrmEntity, TenantMemberOrmEntity, ThemeOrmEntity]),
  ],
  controllers: [TenantsController],
  providers: [
    TenantsService,
    Argon2PasswordHasher,
    {
      provide: TENANT_REPOSITORY,
      useClass: TypeOrmTenantRepository,
    },
  ],
  exports: [TENANT_REPOSITORY, TenantsService],
})
export class TenantsModule {}
