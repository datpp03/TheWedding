import {
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

const featuredWindows = ['today', 'week'] as const;

export class FeaturedAlbumsQueryDto {
  @IsOptional()
  @IsIn(featuredWindows)
  window?: (typeof featuredWindows)[number];
}

export class AlbumSearchQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  ageMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Max(120)
  ageMax?: number;

  @IsOptional()
  @IsString()
  @Length(1, 120)
  region?: string;

  @IsOptional()
  @IsString()
  @Length(1, 200)
  venue?: string;

  @IsOptional()
  @IsString()
  @Length(1, 120)
  theme?: string;

  @IsOptional()
  @IsString()
  from?: string;

  @IsOptional()
  @IsString()
  to?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}

export class CreateWishDto {
  @IsString()
  @Length(1, 500)
  message!: string;
}

export class CreateReactionDto {
  @IsString()
  @Matches(/^[a-z0-9_-]{2,60}$/)
  symbolKey!: string;
}

export class ReactionSymbolDto {
  @IsString()
  @Matches(/^[a-z0-9_-]{2,60}$/)
  symbolKey!: string;

  @IsString()
  @Length(1, 20)
  glyph!: string;
}

export class UpdateReactionSymbolsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReactionSymbolDto)
  symbols!: ReactionSymbolDto[];
}

export class DeleteWishParamsDto {
  @IsUUID()
  wishId!: string;
}
