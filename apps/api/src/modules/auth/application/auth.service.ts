import {
  ConflictException,
  Inject,
  Injectable,
  Optional,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes, randomUUID } from 'node:crypto';
import {
  AUDIT_LOG_REPOSITORY,
  type AuditLogRepository,
} from '../../audit-logs/domain/audit-log.repository';
import { SystemParametersService } from '../../settings/application/system-parameters.service';
import { Argon2PasswordHasher } from '../infrastructure/argon2-password-hasher';
import { TypeOrmAuthRepository } from '../infrastructure/typeorm-auth.repository';
import type { UserOrmEntity } from '../../users/infrastructure/user.orm-entity';
import type { AuthResult, ForgotPasswordResult, RequestContext, SafeUser } from './auth.types';
import { AuthTokenService } from './auth-token.service';

const ACCESS_TOKEN_COOKIE = 'access_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';
const CSRF_TOKEN_COOKIE = 'csrf_token';

export { ACCESS_TOKEN_COOKIE, CSRF_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE };

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: TypeOrmAuthRepository,
    private readonly passwordHasher: Argon2PasswordHasher,
    private readonly tokenService: AuthTokenService,
    private readonly config: ConfigService,
    private readonly systemParameters: SystemParametersService,
    @Optional()
    @Inject(AUDIT_LOG_REPOSITORY)
    private readonly auditLogs?: AuditLogRepository,
  ) {}

  async register(input: {
    email: string;
    password: string;
    displayName: string;
    context: RequestContext;
  }): Promise<AuthResult> {
    await this.systemParameters.assertRegistrationEnabled();
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
    const emailVerificationToken = await this.createEmailVerificationToken(user.id);
    await this.authRepository.recordLogin({
      userId: user.id,
      email,
      success: true,
      ipAddress: input.context.ipAddress,
      userAgent: input.context.userAgent,
    });
    await this.recordAudit({
      action: 'auth.register',
      actorUserId: user.id,
      context: input.context,
      entityId: user.id,
    });

    return {
      ...(await this.issueAuthResult(user, input.context)),
      devEmailVerificationToken: this.canReturnDevTokens() ? emailVerificationToken : undefined,
    };
  }

  async login(input: {
    email: string;
    password: string;
    context: RequestContext;
  }): Promise<AuthResult> {
    await this.systemParameters.assertLoginEnabled();
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
    await this.recordAudit({
      action: 'auth.login',
      actorUserId: user.id,
      context: input.context,
      entityId: user.id,
    });

    return this.issueAuthResult(user, input.context);
  }

  async forgotPassword(input: {
    email: string;
    context: RequestContext;
  }): Promise<ForgotPasswordResult> {
    const email = normalizeEmail(input.email);
    const user = await this.authRepository.findUserByEmail(email);
    let devResetToken: string | undefined;

    if (user && canUserLogin(user)) {
      devResetToken = await this.createPasswordResetToken(user.id);
      await this.recordAudit({
        action: 'auth.password_reset_requested',
        actorUserId: user.id,
        context: input.context,
        entityId: user.id,
      });
    }

    return {
      message: 'If this email is registered, a password reset link will be sent.',
      devResetToken: this.canReturnDevTokens() ? devResetToken : undefined,
    };
  }

  async resetPassword(input: {
    token: string;
    password: string;
    context: RequestContext;
  }): Promise<void> {
    const parsedToken = parseOneTimeToken(input.token);
    const resetToken = await this.authRepository.findPasswordResetTokenById(parsedToken.tokenId);

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt.getTime() <= Date.now()) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    const isValidSecret = await this.passwordHasher.verify(
      resetToken.tokenHash,
      parsedToken.secret,
    );

    if (!isValidSecret) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    const user = await this.authRepository.findUserById(resetToken.userId);

    if (!user) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    const passwordHash = await this.passwordHasher.hash(input.password);
    await this.authRepository.updateUserPassword(user.id, passwordHash);
    await this.authRepository.markPasswordResetTokenUsed(resetToken.id);
    await this.authRepository.revokeUserSessions(user.id);
    await this.recordAudit({
      action: 'auth.password_reset_completed',
      actorUserId: user.id,
      context: input.context,
      entityId: user.id,
    });
  }

  async verifyEmail(input: { token: string; context: RequestContext }): Promise<SafeUser> {
    const parsedToken = parseOneTimeToken(input.token);
    const verificationToken = await this.authRepository.findEmailVerificationTokenById(
      parsedToken.tokenId,
    );

    if (
      !verificationToken ||
      verificationToken.usedAt ||
      verificationToken.expiresAt.getTime() <= Date.now()
    ) {
      throw new UnauthorizedException('Invalid or expired email verification token');
    }

    const isValidSecret = await this.passwordHasher.verify(
      verificationToken.tokenHash,
      parsedToken.secret,
    );

    if (!isValidSecret) {
      throw new UnauthorizedException('Invalid or expired email verification token');
    }

    const user = await this.authRepository.markUserEmailVerified(verificationToken.userId);

    if (!user) {
      throw new UnauthorizedException('Invalid or expired email verification token');
    }

    await this.authRepository.markEmailVerificationTokenUsed(verificationToken.id);
    await this.recordAudit({
      action: 'auth.email_verified',
      actorUserId: user.id,
      context: input.context,
      entityId: user.id,
    });

    return this.toSafeUser(user);
  }

  createCsrfToken() {
    return createTokenSecret(32);
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
    await this.recordAudit({
      action: 'auth.refresh',
      actorUserId: user.id,
      context,
      entityId: session.id,
    });

    return {
      user: safeUser,
      tokens: {
        accessToken,
        refreshToken: newRefreshToken,
      },
    };
  }

  async logout(refreshToken: string | undefined, context: RequestContext = {}): Promise<void> {
    if (!refreshToken) {
      return;
    }

    const [sessionId] = refreshToken.split('.');

    if (sessionId) {
      await this.authRepository.revokeSession(sessionId);
      await this.recordAudit({
        action: 'auth.logout',
        context,
        entityId: sessionId,
      });
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

  async revokeSession(
    userId: string,
    sessionId: string,
    context: RequestContext = {},
  ): Promise<void> {
    const session = await this.authRepository.findSessionById(sessionId);

    if (!session || session.userId !== userId) {
      throw new UnprocessableEntityException('Session was not found');
    }

    await this.authRepository.revokeSession(sessionId);
    await this.recordAudit({
      action: 'auth.session_revoked',
      actorUserId: userId,
      context,
      entityId: sessionId,
    });
  }

  async revokeAllSessions(userId: string, context: RequestContext = {}): Promise<void> {
    const sessions = await this.authRepository.listSessions(userId);
    await Promise.all(sessions.map((session) => this.authRepository.revokeSession(session.id)));
    await this.recordAudit({
      action: 'auth.sessions_revoked',
      actorUserId: userId,
      context,
      entityId: userId,
      metadata: { count: sessions.length },
    });
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

  private async createPasswordResetToken(userId: string): Promise<string> {
    const secret = createTokenSecret(48);
    const tokenHash = await this.passwordHasher.hash(secret);
    const resetToken = await this.authRepository.createPasswordResetToken({
      userId,
      tokenHash,
      expiresAt: this.getPasswordResetExpiry(),
    });

    return formatOneTimeToken(resetToken.id, secret);
  }

  private async createEmailVerificationToken(userId: string): Promise<string> {
    const secret = createTokenSecret(48);
    const tokenHash = await this.passwordHasher.hash(secret);
    const verificationToken = await this.authRepository.createEmailVerificationToken({
      userId,
      tokenHash,
      expiresAt: this.getEmailVerificationExpiry(),
    });

    return formatOneTimeToken(verificationToken.id, secret);
  }

  private getPasswordResetExpiry() {
    const ttl = this.config.get<string>('PASSWORD_RESET_TOKEN_EXPIRES_IN', '1h');
    return new Date(Date.now() + parseDurationMs(ttl));
  }

  private getEmailVerificationExpiry() {
    const ttl = this.config.get<string>('EMAIL_VERIFICATION_TOKEN_EXPIRES_IN', '7d');
    return new Date(Date.now() + parseDurationMs(ttl));
  }

  private canReturnDevTokens() {
    return this.config.get<string>('NODE_ENV', 'local') !== 'production';
  }

  private async recordAudit(input: {
    action: string;
    actorUserId?: string;
    context: RequestContext;
    entityId?: string;
    metadata?: Record<string, unknown>;
  }) {
    await this.auditLogs?.append({
      action: input.action,
      actorUserId: input.actorUserId,
      entityId: input.entityId,
      entityType: 'auth',
      ipAddress: input.context.ipAddress,
      metadata: input.metadata,
      userAgent: input.context.userAgent,
    });
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
  return createTokenSecret(48);
}

function createTokenSecret(bytes: number) {
  return randomBytes(bytes).toString('base64url');
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

function formatOneTimeToken(tokenId: string, secret: string) {
  return `${tokenId}.${secret}`;
}

function parseOneTimeToken(token: string | undefined) {
  const [tokenId, secret] = token?.split('.') ?? [];

  if (!tokenId || !secret) {
    throw new UnauthorizedException('Invalid token');
  }

  return { secret, tokenId };
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
