import { Transform, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class AdminListQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 20;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC', 'asc', 'desc'])
  sortOrder?: 'ASC' | 'DESC' | 'asc' | 'desc';
}

export class AuditLogQueryDto extends AdminListQueryDto {
  @IsOptional()
  @IsString()
  action?: string;

  @IsOptional()
  @IsString()
  entityType?: string;

  @IsOptional()
  @IsString()
  tenantId?: string;
}

export class UpdateUserStatusDto {
  @IsIn(['active', 'pending_verification', 'locked', 'disabled'])
  status!: string;
}

export class UpdateUserRolesDto {
  @IsArray()
  @IsString({ each: true })
  roleCodes!: string[];
}

export class UpdateTenantStatusDto {
  @IsIn(['active', 'suspended', 'archived'])
  status!: string;
}

export class UpdateMediaModerationDto {
  @IsIn(['pending', 'ready', 'processing', 'failed', 'rejected'])
  processingStatus!: string;
}

export class UpsertSettingDto {
  @IsString()
  key!: string;

  @IsString()
  valueJson!: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpsertFeatureFlagDto {
  @IsString()
  key!: string;

  @IsBoolean()
  @Transform(({ value }) => value === true || value === 'true')
  enabled!: boolean;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  rulesJson?: string;
}

export class UpdateSystemParametersDto {
  @IsOptional()
  @IsBoolean()
  disableDownloads?: boolean;

  @IsOptional()
  @IsBoolean()
  disableLogin?: boolean;

  @IsOptional()
  @IsBoolean()
  disableNewUserRegistration?: boolean;

  @IsOptional()
  @IsBoolean()
  disablePaymentCheckout?: boolean;

  @IsOptional()
  @IsBoolean()
  disablePublicGallery?: boolean;

  @IsOptional()
  @IsBoolean()
  disableUploads?: boolean;

  @IsOptional()
  @IsString()
  maintenanceMessage?: string;
}
