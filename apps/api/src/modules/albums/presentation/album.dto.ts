import { IsArray, IsBoolean, IsIn, IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { TENANT_VISIBILITY } from '@the-wedding/shared';

const visibilityValues = Object.values(TENANT_VISIBILITY);

export class CreateAlbumDto {
  @IsString()
  @Length(1, 200)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(visibilityValues)
  visibility?: string;

  @IsOptional()
  @IsBoolean()
  allowDownload?: boolean;
}

export class UpdateAlbumDto {
  @IsOptional()
  @IsString()
  @Length(1, 200)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsIn(visibilityValues)
  visibility?: string;

  @IsOptional()
  @IsBoolean()
  allowDownload?: boolean;
}

export class ReorderAlbumsDto {
  @IsArray()
  @IsUUID('4', { each: true })
  albumIds!: string[];
}

export class SetAlbumCoverDto {
  @IsOptional()
  @IsUUID()
  mediaId?: string | null;
}
