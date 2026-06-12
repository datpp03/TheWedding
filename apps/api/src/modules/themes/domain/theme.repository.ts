import type { WeddingTheme } from '@the-wedding/shared';

export const THEME_REPOSITORY = Symbol('THEME_REPOSITORY');

export type CreateThemeInput = Omit<
  WeddingTheme,
  'createdAt' | 'id' | 'isActive' | 'tenantId' | 'updatedAt'
> & {
  isActive?: boolean;
  tenantId: string;
};

export type UpdateThemeInput = Partial<
  Omit<WeddingTheme, 'createdAt' | 'id' | 'isActive' | 'tenantId' | 'updatedAt'>
>;

export interface ThemeRepository {
  activate(tenantId: string, themeId: string): Promise<WeddingTheme | null>;
  create(input: CreateThemeInput): Promise<WeddingTheme>;
  deleteForTenant(tenantId: string): Promise<void>;
  findActive(tenantId: string): Promise<WeddingTheme | null>;
  findById(tenantId: string, themeId: string): Promise<WeddingTheme | null>;
  listByTenant(tenantId: string): Promise<WeddingTheme[]>;
  update(tenantId: string, themeId: string, input: UpdateThemeInput): Promise<WeddingTheme | null>;
}
