import {
  BadRequestException,
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
import type {
  AuthenticatedResult,
  AuthResult,
  ForgotPasswordResult,
  RequestContext,
  SafeUser,
} from './auth.types';
import { AuthMailService } from './auth-mail.service';
import { AuthTokenService } from './auth-token.service';
import {
  buildTotpUri,
  decryptMfaSecret,
  encryptMfaSecret,
  generateTotpSecret,
  verifyTotpCode,
} from './mfa-totp';
import type { OAuthProfile, OAuthProvider } from './oauth-provider.service';

const ACCESS_TOKEN_COOKIE = 'access_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';
const CSRF_TOKEN_COOKIE = 'csrf_token';
const MFA_CHALLENGE_COOKIE = 'mfa_challenge';
const MFA_CHALLENGE_EXPIRES_IN_SECONDS = 5 * 60;
const OAUTH_ONLY_PASSWORD_HASH_PREFIX = 'oauth-only:';

export { ACCESS_TOKEN_COOKIE, CSRF_TOKEN_COOKIE, MFA_CHALLENGE_COOKIE, REFRESH_TOKEN_COOKIE };

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: TypeOrmAuthRepository,
    private readonly passwordHasher: Argon2PasswordHasher,
    private readonly tokenService: AuthTokenService,
    private readonly authMail: AuthMailService,
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
  }): Promise<AuthenticatedResult> {
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
    await this.authMail.sendEmailVerificationEmail(email, emailVerificationToken);
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

    if (!hasUsablePassword(user)) {
      await this.recordFailedLogin(email, user.id, 'password_not_available', input.context);
      throw new UnauthorizedException('Use a connected OAuth provider to sign in');
    }

    const validPassword = await this.passwordHasher.verify(user.passwordHash, input.password);

    if (!validPassword) {
      await this.recordFailedLogin(email, user.id, 'invalid_credentials', input.context);
      throw new UnauthorizedException('Invalid email or password');
    }

    if (isMfaEnabled(user)) {
      return this.createMfaChallenge(user, input.context);
    }

    await this.recordSuccessfulLogin(user, input.context);
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
      await this.authMail.sendPasswordResetEmail(email, devResetToken);
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

  async resendEmailVerification(input: {
    email: string;
    context: RequestContext;
  }): Promise<{ devEmailVerificationToken?: string; message: string }> {
    const email = normalizeEmail(input.email);
    const user = await this.authRepository.findUserByEmail(email);
    let devEmailVerificationToken: string | undefined;

    if (user && !user.emailVerifiedAt && canUserLogin(user)) {
      devEmailVerificationToken = await this.createEmailVerificationToken(user.id);
      await this.authMail.sendEmailVerificationEmail(email, devEmailVerificationToken);
      await this.recordAudit({
        action: 'auth.email_verification_requested',
        actorUserId: user.id,
        context: input.context,
        entityId: user.id,
      });
    }

    return {
      devEmailVerificationToken: this.canReturnDevTokens() ? devEmailVerificationToken : undefined,
      message: 'If this account needs verification, a new email will be sent.',
    };
  }

  async startMfaEnrollment(userId: string, context: RequestContext) {
    const user = await this.authRepository.findUserById(userId);

    if (!user || !canUserLogin(user)) {
      throw new UnauthorizedException('Authentication required');
    }

    if (isMfaEnabled(user)) {
      throw new ConflictException('MFA is already enabled');
    }

    const secret = generateTotpSecret();
    const enrollmentToken = await this.tokenService.signMfaEnrollmentToken({ secret, userId });

    await this.recordAudit({
      action: 'auth.mfa_enrollment_started',
      actorUserId: user.id,
      context,
      entityId: user.id,
    });

    return {
      enrollmentToken,
      method: 'totp',
      otpauthUri: buildTotpUri({
        accountName: user.email,
        issuer: 'The Wedding',
        secret,
      }),
      secret,
    };
  }

  async verifyMfaEnrollment(input: {
    code: string;
    enrollmentToken: string;
    userId: string;
    context: RequestContext;
  }): Promise<SafeUser> {
    const payload = await this.tokenService.verifyMfaEnrollmentToken(input.enrollmentToken);

    if (payload.sub !== input.userId) {
      throw new UnauthorizedException('MFA enrollment is invalid');
    }

    const user = await this.authRepository.findUserById(input.userId);

    if (!user || !canUserLogin(user)) {
      throw new UnauthorizedException('Authentication required');
    }

    if (!verifyTotpCode({ code: input.code, secret: payload.secret })) {
      await this.recordAudit({
        action: 'auth.mfa_enrollment_failed',
        actorUserId: user.id,
        context: input.context,
        entityId: user.id,
      });
      throw new UnauthorizedException('Invalid MFA code');
    }

    const updatedUser = await this.authRepository.updateUserMfa({
      mfaEnabledAt: new Date(),
      mfaMethod: 'totp',
      mfaSecretEncrypted: encryptMfaSecret(payload.secret, this.getMfaEncryptionKey()),
      userId: user.id,
    });

    if (!updatedUser) {
      throw new UnauthorizedException('Authentication required');
    }

    await this.recordAudit({
      action: 'auth.mfa_enabled',
      actorUserId: user.id,
      context: input.context,
      entityId: user.id,
    });

    return this.toSafeUser(updatedUser);
  }

  async disableMfa(input: {
    code: string;
    context: RequestContext;
    userId: string;
  }): Promise<SafeUser> {
    const user = await this.authRepository.findUserById(input.userId);

    if (!user || !canUserLogin(user)) {
      throw new UnauthorizedException('Authentication required');
    }

    if (!isMfaEnabled(user)) {
      return this.toSafeUser(user);
    }

    if (!this.verifyUserTotp(user, input.code)) {
      await this.recordAudit({
        action: 'auth.mfa_disable_failed',
        actorUserId: user.id,
        context: input.context,
        entityId: user.id,
      });
      throw new UnauthorizedException('Invalid MFA code');
    }

    const updatedUser = await this.authRepository.updateUserMfa({
      mfaEnabledAt: null,
      mfaMethod: null,
      mfaSecretEncrypted: null,
      userId: user.id,
    });

    if (!updatedUser) {
      throw new UnauthorizedException('Authentication required');
    }

    await this.recordAudit({
      action: 'auth.mfa_disabled',
      actorUserId: user.id,
      context: input.context,
      entityId: user.id,
    });

    return this.toSafeUser(updatedUser);
  }

  async completeMfaChallenge(input: {
    challengeToken: string | undefined;
    code: string;
    context: RequestContext;
  }): Promise<AuthenticatedResult> {
    if (!input.challengeToken) {
      throw new UnauthorizedException('MFA challenge is required');
    }

    const payload = await this.tokenService.verifyMfaChallengeToken(input.challengeToken);
    const user = await this.authRepository.findUserById(payload.sub);

    if (!user || !canUserLogin(user) || !isMfaEnabled(user)) {
      throw new UnauthorizedException('MFA challenge has expired or is invalid');
    }

    if (!this.verifyUserTotp(user, input.code)) {
      await this.recordAudit({
        action: 'auth.mfa_challenge_failed',
        actorUserId: user.id,
        context: input.context,
        entityId: user.id,
      });
      throw new UnauthorizedException('Invalid MFA code');
    }

    await this.recordSuccessfulLogin(user, input.context);
    await this.recordAudit({
      action: 'auth.mfa_challenge_completed',
      actorUserId: user.id,
      context: input.context,
      entityId: user.id,
    });

    return this.issueAuthResult(user, input.context);
  }

  async completeOAuthLogin(input: {
    context: RequestContext;
    profile: OAuthProfile;
  }): Promise<AuthResult> {
    await this.systemParameters.assertLoginEnabled();
    const profile = this.validateOAuthProfile(input.profile);
    const linkedAccount = await this.authRepository.findOAuthAccount(
      profile.provider,
      profile.providerSubject,
    );

    if (linkedAccount) {
      const linkedUser = await this.authRepository.findUserById(linkedAccount.userId);
      if (!linkedUser || !canUserLogin(linkedUser)) {
        throw new UnauthorizedException('OAuth account is not available');
      }

      await this.recordAudit({
        action: 'auth.oauth_login_completed',
        actorUserId: linkedUser.id,
        context: input.context,
        entityId: linkedAccount.id,
        metadata: { provider: profile.provider },
      });

      if (isMfaEnabled(linkedUser)) {
        return this.createMfaChallenge(linkedUser, input.context);
      }

      await this.recordSuccessfulLogin(linkedUser, input.context);
      return this.issueAuthResult(linkedUser, input.context);
    }

    const existingUser = await this.authRepository.findUserByEmail(profile.email);
    if (existingUser) {
      await this.recordAudit({
        action: 'auth.oauth_login_failed',
        actorUserId: existingUser.id,
        context: input.context,
        entityId: existingUser.id,
        metadata: { provider: profile.provider, reason: 'existing_email_requires_link' },
      });
      throw new ConflictException(
        'This email already has an account. Sign in with your password, then link this provider in settings.',
      );
    }

    await this.systemParameters.assertRegistrationEnabled();
    const user = await this.authRepository.createUser({
      avatarUrl: profile.avatarUrl,
      displayName: profile.displayName,
      email: profile.email,
      emailVerifiedAt: new Date(),
      passwordHash: createOAuthOnlyPasswordHash(),
      status: 'active',
    });

    await this.authRepository.assignUserRole(user.id);
    const account = await this.authRepository.createOAuthAccount({
      provider: profile.provider,
      providerSubject: profile.providerSubject,
      userId: user.id,
      verifiedEmail: profile.email,
    });

    await this.recordAudit({
      action: 'auth.oauth_login_completed',
      actorUserId: user.id,
      context: input.context,
      entityId: account.id,
      metadata: { provider: profile.provider, registration: 'oauth' },
    });

    await this.recordSuccessfulLogin(user, input.context);
    return this.issueAuthResult(user, input.context);
  }

  async linkOAuthProvider(input: {
    context: RequestContext;
    profile: OAuthProfile;
    userId: string;
  }): Promise<{ linked: true; provider: OAuthProvider }> {
    const profile = this.validateOAuthProfile(input.profile);
    const user = await this.authRepository.findUserById(input.userId);

    if (!user || !canUserLogin(user)) {
      throw new UnauthorizedException('Authentication required');
    }

    if (normalizeEmail(user.email) !== profile.email) {
      await this.recordAudit({
        action: 'auth.oauth_link_failed',
        actorUserId: user.id,
        context: input.context,
        entityId: user.id,
        metadata: { provider: profile.provider, reason: 'email_mismatch' },
      });
      throw new BadRequestException('The provider email must match your account email');
    }

    const existingAccount = await this.authRepository.findOAuthAccount(
      profile.provider,
      profile.providerSubject,
    );
    if (existingAccount && existingAccount.userId !== user.id) {
      throw new ConflictException('This provider account is already linked to another user');
    }

    const linkedAccounts = await this.authRepository.listOAuthAccounts(user.id);
    if (!linkedAccounts.some((account) => account.provider === profile.provider)) {
      const account = await this.authRepository.createOAuthAccount({
        provider: profile.provider,
        providerSubject: profile.providerSubject,
        userId: user.id,
        verifiedEmail: profile.email,
      });
      await this.recordAudit({
        action: 'auth.oauth_link_completed',
        actorUserId: user.id,
        context: input.context,
        entityId: account.id,
        metadata: { provider: profile.provider },
      });
    }

    return { linked: true, provider: profile.provider };
  }

  listOAuthAccounts(userId: string) {
    return this.authRepository.listOAuthAccounts(userId).then((accounts) =>
      accounts.map((account) => ({
        connectedAt: account.createdAt,
        provider: account.provider,
        verifiedEmail: account.verifiedEmail,
      })),
    );
  }

  async unlinkOAuthProvider(input: {
    context: RequestContext;
    provider: OAuthProvider;
    userId: string;
  }): Promise<{ provider: OAuthProvider; unlinked: true }> {
    const user = await this.authRepository.findUserById(input.userId);

    if (!user || !canUserLogin(user)) {
      throw new UnauthorizedException('Authentication required');
    }

    const linkedAccounts = await this.authRepository.listOAuthAccounts(user.id);
    const hasProvider = linkedAccounts.some((account) => account.provider === input.provider);

    if (!hasProvider) {
      throw new UnprocessableEntityException('Provider is not linked');
    }

    if (!hasUsablePassword(user) && linkedAccounts.length <= 1) {
      throw new ConflictException(
        'Add a password or another provider before unlinking this provider',
      );
    }

    await this.authRepository.deleteOAuthAccount(user.id, input.provider);
    await this.recordAudit({
      action: 'auth.oauth_unlinked',
      actorUserId: user.id,
      context: input.context,
      entityId: user.id,
      metadata: { provider: input.provider },
    });

    return { provider: input.provider, unlinked: true };
  }

  async recordOAuthStart(input: {
    actorUserId?: string;
    context: RequestContext;
    mode: 'link' | 'login';
    provider: OAuthProvider;
    returnTo: string;
  }): Promise<void> {
    await this.recordAudit({
      action: input.mode === 'link' ? 'auth.oauth_link_started' : 'auth.oauth_login_started',
      actorUserId: input.actorUserId,
      context: input.context,
      entityId: input.actorUserId,
      metadata: {
        provider: input.provider,
        returnTo: input.returnTo,
      },
    });
  }

  createCsrfToken() {
    return createTokenSecret(32);
  }

  async refresh(
    refreshToken: string | undefined,
    context: RequestContext,
  ): Promise<AuthenticatedResult> {
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
      mfaEnabled: isMfaEnabled(user),
      roles,
      permissions,
    };
  }

  private async issueAuthResult(
    user: UserOrmEntity,
    context: RequestContext,
  ): Promise<AuthenticatedResult> {
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

  private async recordSuccessfulLogin(user: UserOrmEntity, context: RequestContext) {
    await this.authRepository.recordLogin({
      userId: user.id,
      email: user.email,
      success: true,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
    });
    await this.recordAudit({
      action: 'auth.login',
      actorUserId: user.id,
      context,
      entityId: user.id,
    });
  }

  private async createMfaChallenge(
    user: UserOrmEntity,
    context: RequestContext,
  ): Promise<AuthResult> {
    await this.recordAudit({
      action: 'auth.mfa_challenge_created',
      actorUserId: user.id,
      context,
      entityId: user.id,
    });

    return {
      challengeExpiresInSeconds: MFA_CHALLENGE_EXPIRES_IN_SECONDS,
      challengeToken: await this.tokenService.signMfaChallengeToken(user.id),
      mfaRequired: true,
    };
  }

  private validateOAuthProfile(profile: OAuthProfile): OAuthProfile & { email: string } {
    if (!profile.email || !profile.emailVerified) {
      throw new UnauthorizedException('OAuth provider did not return a verified email');
    }

    return {
      ...profile,
      email: normalizeEmail(profile.email),
    };
  }

  private verifyUserTotp(user: UserOrmEntity, code: string) {
    if (!isMfaEnabled(user) || !user.mfaSecretEncrypted) {
      return false;
    }

    try {
      const secret = decryptMfaSecret(user.mfaSecretEncrypted, this.getMfaEncryptionKey());
      return verifyTotpCode({ code, secret });
    } catch {
      return false;
    }
  }

  private getMfaEncryptionKey() {
    return this.config.getOrThrow<string>('COOKIE_SECRET');
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

function isMfaEnabled(user: UserOrmEntity) {
  return Boolean(user.mfaEnabledAt && user.mfaMethod === 'totp' && user.mfaSecretEncrypted);
}

function hasUsablePassword(user: UserOrmEntity) {
  return !user.passwordHash.startsWith(OAUTH_ONLY_PASSWORD_HASH_PREFIX);
}

function createOAuthOnlyPasswordHash() {
  return `${OAUTH_ONLY_PASSWORD_HASH_PREFIX}${randomUUID()}`;
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
