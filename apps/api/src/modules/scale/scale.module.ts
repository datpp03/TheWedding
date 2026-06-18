import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { AlbumOrmEntity } from '../albums/infrastructure/album.orm-entity';
import { MediaOrmEntity } from '../media/infrastructure/media.orm-entity';
import { FeatureFlagOrmEntity } from '../settings/infrastructure/feature-flag.orm-entity';
import { TenantOrmEntity } from '../tenants/infrastructure/tenant.orm-entity';
import { ScaleService } from './application/scale.service';
import { AnalyticsEventOrmEntity } from './infrastructure/analytics-event.orm-entity';
import { CustomDomainOrmEntity } from './infrastructure/custom-domain.orm-entity';
import { EntitlementOrmEntity } from './infrastructure/entitlement.orm-entity';
import { GreetingRuleOrmEntity } from './infrastructure/greeting-rule.orm-entity';
import { PaymentEventOrmEntity } from './infrastructure/payment-event.orm-entity';
import { PlanSubscriptionOrmEntity } from './infrastructure/plan-subscription.orm-entity';
import { StudioClientOrmEntity } from './infrastructure/studio-client.orm-entity';
import { StudioProfileOrmEntity } from './infrastructure/studio-profile.orm-entity';
import { UserPublicHandleOrmEntity } from './infrastructure/user-public-handle.orm-entity';
import { ScaleController } from './presentation/scale.controller';

@Module({
  imports: [
    AuditLogsModule,
    TypeOrmModule.forFeature([
      AlbumOrmEntity,
      AnalyticsEventOrmEntity,
      CustomDomainOrmEntity,
      EntitlementOrmEntity,
      FeatureFlagOrmEntity,
      GreetingRuleOrmEntity,
      MediaOrmEntity,
      PaymentEventOrmEntity,
      PlanSubscriptionOrmEntity,
      StudioClientOrmEntity,
      StudioProfileOrmEntity,
      TenantOrmEntity,
      UserPublicHandleOrmEntity,
    ]),
  ],
  controllers: [ScaleController],
  providers: [ScaleService],
  exports: [ScaleService],
})
export class ScaleModule {}
