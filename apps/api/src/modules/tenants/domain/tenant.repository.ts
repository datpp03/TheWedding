export const TENANT_REPOSITORY = Symbol('TENANT_REPOSITORY');

export interface TenantRepository {
  findByIdForUser(tenantId: string, userId: string): Promise<object | null>;
  findPublicBySlug(slug: string): Promise<object | null>;
}
