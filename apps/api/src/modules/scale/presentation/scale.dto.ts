import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { SCALE_FEATURES, type ScaleFeatureKey } from '@the-wedding/shared';

export class HandleQueryDto {
  @IsString()
  handle!: string;
}

export class UpdateHandleDto {
  @IsString()
  handle!: string;
}

export class GrantEntitlementDto {
  @IsIn(['tenant', 'user'])
  subjectType!: 'tenant' | 'user';

  @IsUUID()
  subjectId!: string;

  @IsOptional()
  @IsIn(Object.values(SCALE_FEATURES))
  featureKey?: ScaleFeatureKey;

  @IsOptional()
  @IsNumberString()
  storageBoostBytes?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === true || value === 'true')
  granted?: boolean;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  expiresAt?: string;
}

export class RecordPaymentEventDto {
  @IsIn(['momo'])
  provider!: 'momo';

  @IsString()
  providerEventId!: string;

  @IsString()
  eventType!: string;

  @IsString()
  status!: string;

  @IsOptional()
  @IsNumberString()
  amount?: string;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  metadata?: Record<string, unknown>;
}

export class RecordAnalyticsEventDto {
  @IsUUID()
  tenantId!: string;

  @IsOptional()
  @IsUUID()
  albumId?: string;

  @IsOptional()
  @IsUUID()
  mediaId?: string;

  @IsIn(['gallery_view', 'media_download'])
  eventType!: 'gallery_view' | 'media_download';

  @IsOptional()
  metadata?: Record<string, unknown>;
}

export class CreateGreetingRuleDto {
  @IsIn(['global', 'tenant', 'user'])
  scopeType!: 'global' | 'tenant' | 'user';

  @IsOptional()
  @IsUUID()
  scopeId?: string;

  @IsIn(['birthday', 'custom', 'proposal_anniversary', 'tet', 'valentine', 'wedding_anniversary'])
  triggerType!:
    | 'birthday'
    | 'custom'
    | 'proposal_anniversary'
    | 'tet'
    | 'valentine'
    | 'wedding_anniversary';

  @IsIn(['vi', 'en', 'ja'])
  locale!: 'vi' | 'en' | 'ja';

  @IsString()
  templateKey!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  dateMonth?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(31)
  dateDay?: number;

  @IsOptional()
  @IsString()
  customDate?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === true || value === 'true')
  enabled?: boolean;
}
