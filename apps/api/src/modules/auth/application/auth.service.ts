import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes, randomUUID } from 'node:crypto';
import { Argon2PasswordHasher } from '../infrastructure/argon2-password-hasher';
import { TypeOrmAuthRepository } from '../infrastructure/typeorm-auth.repository';
import type { UserOrmEntity } from '../../users/infrastructure/user.orm-entity';
import type { AuthResult, RequestContext, SafeUser } from './auth.types';
import { AuthTokenService } from './auth-token.service';

const ACCESS_TOKEN_COOKIE = 'access_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';

export { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE };

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: TypeOrmAuthRepository,
    private readonly passwordHasher: Argon2PasswordHasher,
    private readonly tokenService: AuthTokenService,
    private readonly config: ConfigService,
  ) {}

  async register(input: {
    email: string;
    password: string;
    displayName: string;
    context: RequestContext;
  }): Promise<AuthResult> {
    const email = normalizeEmail(input.email);
    const existingUser = await this.authRepository.findUserByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const passwordHash = await this.passwordHasher.hash(input.password);
    const user = await this.authRepository.createUser({
      email,
      passwordHash,
      displayName: input.displayName.trim(),
      status: 'pending_verification',
    });

    await this.authRepository.assignUserRole(user.id);
    await this.authRepository.recordLogin({
      userId: user.id,
      email,
      success: true,
      ipAddress: input.context.ipAddress,
      userAgent: input.context.userAgent,
    });

    return this.issueAuthResult(user, input.context);
  }

  async login(input: {
    email: string;
    password: string;
    context: RequestContext;
  }): Promise<AuthResult> {
    const email = normalizeEmail(input.email);
    const user = await this.authRepository.findUserByEmail(email);

    if (!user) {
      await this.recordFailedLogin(email, null, 'invalid_credentials', input.context);
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!canUserLogin(user)) {
      await this.recordFailedLogin(email, user.id, 'account_not_allowed', input.context);
      throw new UnauthorizedException('Invalid email or password');
    }

    const validPassword = await this.passwordHasher.verify(user.passwordHash, input.password);

    if (!validPassword) {
      await this.recordFailedLogin(email, user.id, 'invalid_credentials', input.context);
      throw new UnauthorizedException('Invalid email or password');
    }

    await this.authRepository.recordLogin({
      userId: user.id,
      email,
      success: true,
      ipAddress: input.context.ipAddress,
      userAgent: input.context.userAgent,
    });

    return this.issueAuthResult(user, input.context);
  }

  async refresh(refreshToken: string | undefined, context: RequestContext): Promise<AuthResult> {
    const parsedToken = parseRefreshToken(refreshToken);
    const session = await this.authRepository.findSessionById(parsedToken.sessionId);

    if (!session || session.revokedAt || session.expiresAt.getTime() <= Date.now()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isValidSecret = await this.passwordHasher.verify(
      session.refreshTokenHash,
      parsedToken.secret,
    );

    if (!isValidSecret) {
      await this.authRepository.revokeSessionFamily(session.refreshTokenFamilyId);
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.authRepository.findUserById(session.userId);

    if (!user || !canUserLogin(user)) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const newSecret = createRefreshSecret();
    const newRefreshToken = formatRefreshToken(session.id, newSecret);
    const expiresAt = this.getRefreshExpiry();
    const refreshTokenHash = await this.passwordHasher.hash(newSecret);

    await this.authRepository.rotateSession(session.id, refreshTokenHash, expiresAt);

    const safeUser = await this.toSafeUser(user);
    const accessToken = await this.signAccessToken(user, session.id);

    await this.authRepository.recordLogin({
      userId: user.id,
      email: user.email,
      success: true,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
    });

    return {
      user: safeUser,
      tokens: {
        accessToken,
        refreshToken: newRefreshToken,
      },
    };
  }

  async logout(refreshToken: string | undefined): Promise<void> {
    if (!refreshToken) {
      return;
    }

    const [sessionId] = refreshToken.split('.');

    if (sessionId) {
      await this.authRepository.revokeSession(sessionId);
    }
  }

  async getCurrentUser(userId: string): Promise<SafeUser> {
    const user = await this.authRepository.findUserById(userId);

    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    return this.toSafeUser(user);
  }

  listSessions(userId: string) {
    return this.authRepository.listSessions(userId);
  }

  async revokeSession(userId: string, sessionId: string): Promise<void> {
    const session = await this.authRepository.findSessionById(sessionId);

    if (!session || session.userId !== userId) {
      throw new UnprocessableEntityException('Session was not found');
    }

    await this.authRepository.revokeSession(sessionId);
  }

  async revokeAllSessions(userId: string): Promise<void> {
    const sessions = await this.authRepository.listSessions(userId);
    await Promise.all(sessions.map((session) => this.authRepository.revokeSession(session.id)));
  }

  async toSafeUser(user: UserOrmEntity): Promise<SafeUser> {
    const [roles, permissions] = await Promise.all([
      this.authRepository.getRoleCodes(user.id),
      this.authRepository.getPermissionCodes(user.id),
    ]);

    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      status: user.status,
      emailVerifiedAt: user.emailVerifiedAt,
      roles,
      permissions,
    };
  }

  private async issueAuthResult(user: UserOrmEntity, context: RequestContext): Promise<AuthResult> {
    const refreshSecret = createRefreshSecret();
    const refreshTokenHash = await this.passwordHasher.hash(refreshSecret);
    const session = await this.authRepository.createSession({
      userId: user.id,
      refreshTokenHash,
      refreshTokenFamilyId: randomUUID(),
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      expiresAt: this.getRefreshExpiry(),
    });

    const safeUser = await this.toSafeUser(user);
    const accessToken = await this.signAccessToken(user, session.id);

    return {
      user: safeUser,
      tokens: {
        accessToken,
        refreshToken: formatRefreshToken(session.id, refreshSecret),
      },
    };
  }

  private async signAccessToken(user: UserOrmEntity, sessionId: string): Promise<string> {
    const [roles, permissions, tenantIds] = await Promise.all([
      this.authRepository.getRoleCodes(user.id),
      this.authRepository.getPermissionCodes(user.id),
      this.authRepository.getTenantIds(user.id),
    ]);

    return this.tokenService.signAccessToken({
      sub: user.id,
      email: user.email,
      sessionId,
      roles,
      permissions,
      tenantIds,
    });
  }

  private async recordFailedLogin(
    email: string,
    userId: string | null,
    failureReason: string,
    context: RequestContext,
  ) {
    await this.authRepository.recordLogin({
      userId,
      email,
      success: false,
      failureReason,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
    });
  }

  private getRefreshExpiry() {
    const ttl = this.config.get<string>('REFRESH_TOKEN_EXPIRES_IN', '30d');
    return new Date(Date.now() + parseDurationMs(ttl));
  }
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function canUserLogin(user: UserOrmEntity) {
  const lockExpired = !user.lockedUntil || user.lockedUntil.getTime() <= Date.now();
  return lockExpired && (user.status === 'active' || user.status === 'pending_verification');
}

function createRefreshSecret() {
  return randomBytes(48).toString('base64url');
}

function formatRefreshToken(sessionId: string, secret: string) {
  return `${sessionId}.${secret}`;
}

function parseRefreshToken(refreshToken: string | undefined) {
  const [sessionId, secret] = refreshToken?.split('.') ?? [];

  if (!sessionId || !secret) {
    throw new UnauthorizedException('Invalid refresh token');
  }

  return { sessionId, secret };
}

function parseDurationMs(value: string) {
  const match = /^(?<amount>\d+)(?<unit>[smhd])$/.exec(value);

  if (!match?.groups) {
    return 30 * 24 * 60 * 60 * 1000;
  }

  const amount = Number(match.groups.amount);
  const unit = match.groups.unit;

  switch (unit) {
    case 's':
      return amount * 1000;
    case 'm':
      return amount * 60 * 1000;
    case 'h':
      return amount * 60 * 60 * 1000;
    case 'd':
      return amount * 24 * 60 * 60 * 1000;
    default:
      return 30 * 24 * 60 * 60 * 1000;
  }
}
