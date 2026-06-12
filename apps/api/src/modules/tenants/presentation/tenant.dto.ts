import {
  IsDateString,
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TENANT_VISIBILITY, type TenantVisibility } from '@the-wedding/shared';

export class CreateTenantDto {
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  siteName!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(60)
  slug!: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  brideName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  groomName?: string;

  @IsOptional()
  @IsDateString()
  weddingDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  description?: string;
}

export class UpdateTenantDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  siteName?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(60)
  slug?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  brideName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  groomName?: string;

  @IsOptional()
  @IsDateString()
  weddingDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  description?: string;

  @IsOptional()
  @IsObject()
  seo?: Record<string, string>;

  @IsOptional()
  @IsObject()
  sharing?: Record<string, string>;
}

export class UpdateTenantSettingsDto {
  @IsOptional()
  @IsString()
  @MaxLength(40)
  accentColor?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  coverImageUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  welcomeMessage?: string;
}

export class UpdateTenantVisibilityDto {
  @IsIn(Object.values(TENANT_VISIBILITY))
  visibility!: TenantVisibility;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(200)
  password?: string;
}
