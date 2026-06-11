export const SESSION_REPOSITORY = Symbol('SESSION_REPOSITORY');

export type CreateSessionInput = {
  userId: string;
  refreshTokenHash: string;
  refreshTokenFamilyId: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: Date;
};

export interface SessionRepository {
  create(input: CreateSessionInput): Promise<void>;
  revoke(sessionId: string, revokedAt: Date): Promise<void>;
  revokeFamily(refreshTokenFamilyId: string, revokedAt: Date): Promise<void>;
}
