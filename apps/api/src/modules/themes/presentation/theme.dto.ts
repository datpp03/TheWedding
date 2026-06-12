import { IsBoolean, IsObject, IsOptional, IsString } from 'class-validator';
import type { WeddingTheme } from '@the-wedding/shared';

export class ThemePayloadDto implements Partial<WeddingTheme> {
  @IsOptional()
  @IsString()
  presetId?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsObject()
  colors?: WeddingTheme['colors'];

  @IsOptional()
  @IsObject()
  typography?: WeddingTheme['typography'];

  @IsOptional()
  @IsString()
  layoutType?: WeddingTheme['layoutType'];

  @IsOptional()
  @IsString()
  styleType?: WeddingTheme['styleType'];

  @IsOptional()
  @IsString()
  animationType?: WeddingTheme['animationType'];

  @IsOptional()
  @IsObject()
  config?: WeddingTheme['config'];

  @IsOptional()
  @IsString()
  customCss?: string | null;
}

export class CreateThemeDto extends ThemePayloadDto {
  @IsOptional()
  @IsBoolean()
  activate?: boolean;
}
