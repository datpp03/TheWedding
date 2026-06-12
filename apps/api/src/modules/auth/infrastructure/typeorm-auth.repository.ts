import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { PermissionCode, RoleCode } from '@the-wedding/shared';
import { Repository } from 'typeorm';
import { UserOrmEntity } from '../../users/infrastructure/user.orm-entity';
import { UserLoginHistoryOrmEntity } from './user-login-history.orm-entity';
import { UserSessionOrmEntity } from './user-session.orm-entity';

export type CreateUserInput = {
  email: string;
  passwordHash: string;
  displayName: string;
  status: string;
};

export type CreateSessionInput = {
  userId: string;
  refreshTokenHash: string;
  refreshTokenFamilyId: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: Date;
};

export type LoginHistoryInput = {
  userId: string | null;
  email: string;
  success: boolean;
  failureReason?: string;
  ipAddress?: string;
  userAgent?: string;
};

export type SessionView = {
  id: string;
  deviceName: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
};

@Injectable()
export class TypeOrmAuthRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly users: Repository<UserOrmEntity>,
    @InjectRepository(UserSessionOrmEntity)
    private readonly sessions: Repository<UserSessionOrmEntity>,
    @InjectRepository(UserLoginHistoryOrmEntity)
    private readonly loginHistories: Repository<UserLoginHistoryOrmEntity>,
  ) {}

  findUserByEmail(email: string): Promise<UserOrmEntity | null> {
    return this.users.findOne({ where: { email } });
  }

  findUserById(id: string): Promise<UserOrmEntity | null> {
    return this.users.findOne({ where: { id } });
  }

  async createUser(input: CreateUserInput): Promise<UserOrmEntity> {
    const user = this.users.create(input);
    return this.users.save(user);
  }

  async getRoleCodes(userId: string): Promise<RoleCode[]> {
    const rows = toRows<{ code: RoleCode }>(
      await this.users.query(
        `
        SELECT r.[code]
        FROM [user_roles] ur
        INNER JOIN [roles] r ON r.[id] = ur.[roleId]
        WHERE ur.[userId] = @0
      `,
        [userId],
      ),
    );

    return rows.map((row: { code: RoleCode }) => row.code);
  }

  async getPermissionCodes(userId: string): Promise<PermissionCode[]> {
    const rows = toRows<{ code: PermissionCode }>(
      await this.users.query(
        `
        SELECT DISTINCT p.[code]
        FROM [user_roles] ur
        INNER JOIN [role_permissions] rp ON rp.[roleId] = ur.[roleId]
        INNER JOIN [permissions] p ON p.[id] = rp.[permissionId]
        WHERE ur.[userId] = @0
      `,
        [userId],
      ),
    );

    return rows.map((row: { code: PermissionCode }) => row.code);
  }

  async getTenantIds(userId: string): Promise<string[]> {
    const rows = toRows<{ tenantId: string }>(
      await this.users.query(
        `
        SELECT [tenantId]
        FROM [tenant_members]
        WHERE [userId] = @0
      `,
        [userId],
      ),
    );

    return rows.map((row: { tenantId: string }) => row.tenantId);
  }

  async assignUserRole(userId: string): Promise<void> {
    await this.users.query(
      `
        INSERT INTO [user_roles] ([userId], [roleId])
        SELECT @0, r.[id]
        FROM [roles] r
        WHERE r.[code] = 'USER'
          AND NOT EXISTS (
            SELECT 1 FROM [user_roles] ur
            WHERE ur.[userId] = @0 AND ur.[roleId] = r.[id]
          )
      `,
      [userId],
    );
  }

  async recordLogin(input: LoginHistoryInput): Promise<void> {
    const history = this.loginHistories.create({
      userId: input.userId,
      email: input.email,
      success: input.success,
      failureReason: input.failureReason ?? null,
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
    });
    await this.loginHistories.save(history);
  }

  async createSession(input: CreateSessionInput): Promise<UserSessionOrmEntity> {
    const session = this.sessions.create({
      userId: input.userId,
      refreshTokenHash: input.refreshTokenHash,
      refreshTokenFamilyId: input.refreshTokenFamilyId,
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
      expiresAt: input.expiresAt,
      revokedAt: null,
    });

    return this.sessions.save(session);
  }

  findSessionById(id: string): Promise<UserSessionOrmEntity | null> {
    return this.sessions.findOne({ where: { id } });
  }

  async rotateSession(sessionId: string, refreshTokenHash: string, expiresAt: Date): Promise<void> {
    await this.sessions.update(sessionId, {
      refreshTokenHash,
      expiresAt,
      revokedAt: null,
    });
  }

  async revokeSession(sessionId: string): Promise<void> {
    await this.sessions.update(sessionId, { revokedAt: new Date() });
  }

  async revokeSessionFamily(refreshTokenFamilyId: string): Promise<void> {
    await this.sessions.update({ refreshTokenFamilyId }, { revokedAt: new Date() });
  }

  async listSessions(userId: string): Promise<SessionView[]> {
    const sessions = await this.sessions.find({
      order: { createdAt: 'DESC' },
      where: { userId },
    });

    return sessions.map((session) => ({
      id: session.id,
      deviceName: session.deviceName,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      expiresAt: session.expiresAt,
      revokedAt: session.revokedAt,
      createdAt: session.createdAt,
    }));
  }
}

function toRows<TRow>(value: unknown): TRow[] {
  return Array.isArray(value) ? (value as TRow[]) : [];
}
