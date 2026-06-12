import { IsArray, IsISO8601, IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class UploadMediaDto {
  @IsUUID()
  albumId!: string;
}

export class UpdateMediaDto {
  @IsOptional()
  @IsString()
  @Length(0, 200)
  title?: string | null;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsISO8601()
  takenAt?: string | null;
}

export class ReorderMediaDto {
  @IsArray()
  @IsUUID('4', { each: true })
  mediaIds!: string[];
}

export class MoveMediaDto {
  @IsUUID()
  albumId!: string;
}

export class BatchDeleteMediaDto {
  @IsArray()
  @IsUUID('4', { each: true })
  mediaIds!: string[];
}
