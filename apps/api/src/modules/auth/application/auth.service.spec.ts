import {
  ConflictException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { UserOrmEntity } from '../../users/infrastructure/user.orm-entity';
import type { Argon2PasswordHasher } from '../infrastructure/argon2-password-hasher';
import { AuthService } from './auth.service';
import { createTotpCode, encryptMfaSecret, generateTotpSecret } from './mfa-totp';
import type { OAuthProfile } from './oauth-provider.service';

type MockRepository = {
  assignUserRole: jest.MockedFunction<(userId: string) => Promise<void>>;
  createOAuthAccount: jest.MockedFunction<(input: unknown) => Promise<OAuthAccount>>;
  createEmailVerificationToken: jest.MockedFunction<(input: unknown) => Promise<{ id: string }>>;
  createPasswordResetToken: jest.MockedFunction<(input: unknown) => Promise<{ id: string }>>;
  createSession: jest.MockedFunction<(input: unknown) => Promise<{ id: string }>>;
  createUser: jest.MockedFunction<(input: unknown) => Promise<UserOrmEntity>>;
  deleteOAuthAccount: jest.MockedFunction<(userId: string, provider: string) => Promise<void>>;
  findEmailVerificationTokenById: jest.MockedFunction<(id: string) => Promise<OneTimeToken | null>>;
  findOAuthAccount: jest.MockedFunction<
    (provider: string, providerSubject: string) => Promise<OAuthAccount | null>
  >;
  findPasswordResetTokenById: jest.MockedFunction<(id: string) => Promise<OneTimeToken | null>>;
  findSessionById: jest.MockedFunction<(id: string) => Promise<Session | null>>;
  findUserByEmail: jest.MockedFunction<(email: string) => Promise<UserOrmEntity | null>>;
  findUserById: jest.MockedFunction<(id: string) => Promise<UserOrmEntity | null>>;
  getPermissionCodes: jest.MockedFunction<(userId: string) => Promise<[]>>;
  getRoleCodes: jest.MockedFunction<(userId: string) => Promise<['USER']>>;
  getTenantIds: jest.MockedFunction<(userId: string) => Promise<[]>>;
  listOAuthAccounts: jest.MockedFunction<(userId: string) => Promise<OAuthAccount[]>>;
  listSessions: jest.MockedFunction<(userId: string) => Promise<[]>>;
  markEmailVerificationTokenUsed: jest.MockedFunction<(id: string) => Promise<void>>;
  markPasswordResetTokenUsed: jest.MockedFunction<(id: string) => Promise<void>>;
  markUserEmailVerified: jest.MockedFunction<(userId: string) => Promise<UserOrmEntity | null>>;
  recordLogin: jest.MockedFunction<(input: unknown) => Promise<void>>;
  revokeSession: jest.MockedFunction<(sessionId: string) => Promise<void>>;
  revokeSessionFamily: jest.MockedFunction<(familyId: string) => Promise<void>>;
  revokeUserSessions: jest.MockedFunction<(userId: string) => Promise<void>>;
  rotateSession: jest.MockedFunction<
    (sessionId: string, refreshTokenHash: string, expiresAt: Date) => Promise<void>
  >;
  updateUserMfa: jest.MockedFunction<(input: unknown) => Promise<UserOrmEntity | null>>;
  updateUserPassword: jest.MockedFunction<(userId: string, passwordHash: string) => Promise<void>>;
};

type OAuthAccount = {
  id: string;
  provider: string;
  providerSubject: string;
  userId: string;
  verifiedEmail: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

type Session = {
  id: string;
  userId: string;
  refreshTokenHash: string;
  refreshTokenFamilyId: string;
  expiresAt: Date;
  revokedAt: Date | null;
};

type OneTimeToken = {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  usedAt: Date | null;
};

type MockPasswordHasher = {
  hash: jest.MockedFunction<Argon2PasswordHasher['hash']>;
  verify: jest.MockedFunction<Argon2PasswordHasher['verify']>;
};

type MockAuthMailService = {
  sendEmailVerificationEmail: jest.MockedFunction<(email: string, token: string) => Promise<void>>;
  sendPasswordResetEmail: jest.MockedFunction<(email: string, token: string) => Promise<void>>;
};

type MockAuthTokenService = {
  signAccessToken: jest.MockedFunction<() => Promise<string>>;
  signMfaChallengeToken: jest.MockedFunction<(userId: string) => Promise<string>>;
  signMfaEnrollmentToken: jest.MockedFunction<
    (input: { secret: string; userId: string }) => Promise<string>
  >;
  verifyMfaChallengeToken: jest.MockedFunction<(token: string) => Promise<{ sub: string }>>;
  verifyMfaEnrollmentToken: jest.MockedFunction<
    (token: string) => Promise<{ secret: string; sub: string }>
  >;
};

const context = {
  ipAddress: '127.0.0.1',
  userAgent: 'jest',
};
const TEST_COOKIE_SECRET = 'test-cookie-secret-with-at-least-32-characters';

describe(AuthService.name, () => {
  it('registers a user, assigns USER role, and issues tokens', async () => {
    const user = createUser({ email: 'new@example.com' });
    const { authMail, repository, service } = createService();

    repository.findUserByEmail.mockResolvedValue(null);
    repository.createUser.mockResolvedValue(user);

    const result = await service.register({
      email: ' New@Example.com ',
      password: 'ChangeMe!123456',
      displayName: ' New User ',
      context,
    });

    expect(repository.createUser).toHaveBeenCalledWith({
      email: 'new@example.com',
      passwordHash: 'hash:ChangeMe!123456',
      displayName: 'New User',
      status: 'pending_verification',
    });
    expect(repository.assignUserRole).toHaveBeenCalledWith(user.id);
    expect(repository.createEmailVerificationToken).toHaveBeenCalledWith(
      expect.objectContaining({ userId: user.id }),
    );
    expect(result.user.email).toBe('new@example.com');
    expect(result.tokens.accessToken).toBe('access-token');
    expect(result.tokens.refreshToken).toMatch(/^session-1\./);
    expect(result.devEmailVerificationToken).toMatch(/^email-token-1\./);
    expect(authMail.sendEmailVerificationEmail).toHaveBeenCalledWith(
      'new@example.com',
      expect.stringMatching(/^email-token-1\./),
    );
  });

  it('blocks duplicate registration', async () => {
    const { repository, service } = createService();

    repository.findUserByEmail.mockResolvedValue(createUser({ email: 'taken@example.com' }));

    await expect(
      service.register({
        email: 'taken@example.com',
        password: 'ChangeMe!123456',
        displayName: 'Taken',
        context,
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('blocks registration when the runtime parameter disables it', async () => {
    const { service, systemParameters } = createService();
    systemParameters.assertRegistrationEnabled.mockRejectedValue(
      new ServiceUnavailableException('Registration disabled'),
    );

    await expect(
      service.register({
        email: 'new@example.com',
        password: 'ChangeMe!123456',
        displayName: 'New',
        context,
      }),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);
  });

  it('records failed login without revealing whether the email exists', async () => {
    const { repository, service } = createService();

    repository.findUserByEmail.mockResolvedValue(null);

    await expect(
      service.login({
        email: 'missing@example.com',
        password: 'wrong',
        context,
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(repository.recordLogin).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'missing@example.com',
        failureReason: 'invalid_credentials',
        success: false,
      }),
    );
  });

  it('blocks login when the runtime parameter disables it', async () => {
    const { service, systemParameters } = createService();
    systemParameters.assertLoginEnabled.mockRejectedValue(
      new ServiceUnavailableException('Login disabled'),
    );

    await expect(
      service.login({
        email: 'user@example.com',
        password: 'ChangeMe!123456',
        context,
      }),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);
  });

  it('does not expose reset or verification dev tokens in production', async () => {
    const user = createUser({ email: 'prod@example.com' });
    const { repository, service } = createService({ nodeEnv: 'production' });

    repository.findUserByEmail.mockResolvedValueOnce(null);
    repository.createUser.mockResolvedValue(user);

    const registerResult = await service.register({
      email: 'prod@example.com',
      password: 'ChangeMe!123456',
      displayName: 'Prod',
      context,
    });

    expect(registerResult.devEmailVerificationToken).toBeUndefined();

    repository.findUserByEmail.mockResolvedValueOnce(user);
    const forgotResult = await service.forgotPassword({ email: 'prod@example.com', context });

    expect(forgotResult.devResetToken).toBeUndefined();
  });

  it('returns an MFA challenge instead of issuing a full session when MFA is enabled', async () => {
    const user = createUser({
      mfaEnabledAt: new Date(),
      mfaMethod: 'totp',
      mfaSecretEncrypted: 'encrypted-secret',
    });
    const { repository, service } = createService();

    repository.findUserByEmail.mockResolvedValue(user);

    const result = await service.login({
      email: user.email,
      password: 'ChangeMe!123456',
      context,
    });

    expect(result).toEqual({
      challengeExpiresInSeconds: 300,
      challengeToken: 'mfa-challenge-token',
      mfaRequired: true,
    });
    expect(repository.createSession).not.toHaveBeenCalled();
  });

  it('completes a valid MFA challenge and rejects invalid OTP codes', async () => {
    const secret = generateTotpSecret();
    const user = createUser({
      mfaEnabledAt: new Date(),
      mfaMethod: 'totp',
      mfaSecretEncrypted: encryptMfaSecret(secret, TEST_COOKIE_SECRET),
    });
    const { repository, service } = createService();

    repository.findUserById.mockResolvedValue(user);

    await expect(
      service.completeMfaChallenge({
        challengeToken: 'mfa-challenge-token',
        code: '000000',
        context,
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    const result = await service.completeMfaChallenge({
      challengeToken: 'mfa-challenge-token',
      code: createTotpCode(secret),
      context,
    });

    expect(result.tokens.accessToken).toBe('access-token');
    expect(repository.createSession).toHaveBeenCalled();
  });

  it('enables and disables TOTP MFA after valid OTP verification', async () => {
    const user = createUser({ id: 'user-1' });
    const { repository, service, tokenService } = createService();

    repository.findUserById.mockResolvedValue(user);

    const enrollment = await service.startMfaEnrollment(user.id, context);
    tokenService.verifyMfaEnrollmentToken.mockResolvedValue({
      secret: enrollment.secret,
      sub: user.id,
    });
    repository.updateUserMfa.mockResolvedValue(
      createUser({
        ...user,
        mfaEnabledAt: new Date(),
        mfaMethod: 'totp',
        mfaSecretEncrypted: encryptMfaSecret(enrollment.secret, TEST_COOKIE_SECRET),
      }),
    );

    const enrolledUser = await service.verifyMfaEnrollment({
      code: createTotpCode(enrollment.secret),
      context,
      enrollmentToken: enrollment.enrollmentToken,
      userId: user.id,
    });

    expect(enrolledUser.mfaEnabled).toBe(true);
    expect(repository.updateUserMfa).toHaveBeenCalledWith(
      expect.objectContaining({ mfaMethod: 'totp', userId: user.id }),
    );

    const enabledUser = createUser({
      ...user,
      mfaEnabledAt: new Date(),
      mfaMethod: 'totp',
      mfaSecretEncrypted: encryptMfaSecret(enrollment.secret, TEST_COOKIE_SECRET),
    });
    repository.findUserById.mockResolvedValue(enabledUser);
    repository.updateUserMfa.mockResolvedValue(createUser(user));

    const disabledUser = await service.disableMfa({
      code: createTotpCode(enrollment.secret),
      context,
      userId: user.id,
    });

    expect(disabledUser.mfaEnabled).toBe(false);
    expect(repository.updateUserMfa).toHaveBeenLastCalledWith(
      expect.objectContaining({
        mfaEnabledAt: null,
        mfaMethod: null,
        mfaSecretEncrypted: null,
        userId: user.id,
      }),
    );
  });

  it('rotates a valid refresh token and revokes the family on token reuse', async () => {
    const user = createUser({ id: 'user-1' });
    const session = createSession({ userId: user.id, refreshTokenHash: 'hash:old-secret' });
    const { passwordHasher, repository, service } = createService();

    repository.findSessionById.mockResolvedValue(session);
    repository.findUserById.mockResolvedValue(user);

    const result = await service.refresh('session-1.old-secret', context);

    expect(repository.rotateSession).toHaveBeenCalledWith(
      'session-1',
      expect.stringMatching(/^hash:/),
      expect.any(Date),
    );
    expect(result.tokens.refreshToken).toMatch(/^session-1\./);

    passwordHasher.verify.mockResolvedValue(false);

    await expect(service.refresh('session-1.replayed-secret', context)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(repository.revokeSessionFamily).toHaveBeenCalledWith('family-1');
  });

  it('returns a generic forgot password response and creates a reset token for existing users', async () => {
    const user = createUser({ id: 'user-1', email: 'owner@example.com' });
    const { authMail, repository, service } = createService();

    repository.findUserByEmail.mockResolvedValue(user);

    const result = await service.forgotPassword({
      email: 'Owner@Example.com',
      context,
    });

    expect(result.message).toContain('If this email is registered');
    expect(result.devResetToken).toMatch(/^reset-token-1\./);
    expect(repository.createPasswordResetToken).toHaveBeenCalledWith(
      expect.objectContaining({ userId: user.id }),
    );
    expect(authMail.sendPasswordResetEmail).toHaveBeenCalledWith(
      'owner@example.com',
      expect.stringMatching(/^reset-token-1\./),
    );
  });

  it('does not reveal missing emails during forgot password', async () => {
    const { repository, service } = createService();

    repository.findUserByEmail.mockResolvedValue(null);

    const result = await service.forgotPassword({
      email: 'missing@example.com',
      context,
    });

    expect(result.message).toContain('If this email is registered');
    expect(result.devResetToken).toBeUndefined();
    expect(repository.createPasswordResetToken).not.toHaveBeenCalled();
  });

  it('resets password, revokes sessions, and rejects token reuse', async () => {
    const user = createUser({ id: 'user-1' });
    const { repository, service } = createService();

    repository.findPasswordResetTokenById.mockResolvedValue(
      createOneTimeToken({
        id: 'reset-token-1',
        userId: user.id,
        tokenHash: 'hash:reset-secret',
      }),
    );
    repository.findUserById.mockResolvedValue(user);

    await service.resetPassword({
      token: 'reset-token-1.reset-secret',
      password: 'NewPassword!123',
      context,
    });

    expect(repository.updateUserPassword).toHaveBeenCalledWith(user.id, 'hash:NewPassword!123');
    expect(repository.markPasswordResetTokenUsed).toHaveBeenCalledWith('reset-token-1');
    expect(repository.revokeUserSessions).toHaveBeenCalledWith(user.id);

    repository.findPasswordResetTokenById.mockResolvedValue(
      createOneTimeToken({
        id: 'reset-token-1',
        usedAt: new Date(),
      }),
    );

    await expect(
      service.resetPassword({
        token: 'reset-token-1.reset-secret',
        password: 'NewPassword!123',
        context,
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('verifies email and rejects reused verification tokens', async () => {
    const verifiedUser = createUser({
      emailVerifiedAt: new Date(),
      status: 'active',
    });
    const { repository, service } = createService();

    repository.findEmailVerificationTokenById.mockResolvedValue(
      createOneTimeToken({
        id: 'email-token-1',
        userId: verifiedUser.id,
        tokenHash: 'hash:email-secret',
      }),
    );
    repository.markUserEmailVerified.mockResolvedValue(verifiedUser);

    const result = await service.verifyEmail({
      token: 'email-token-1.email-secret',
      context,
    });

    expect(repository.markUserEmailVerified).toHaveBeenCalledWith(verifiedUser.id);
    expect(repository.markEmailVerificationTokenUsed).toHaveBeenCalledWith('email-token-1');
    expect(result.emailVerifiedAt).toEqual(verifiedUser.emailVerifiedAt);

    repository.findEmailVerificationTokenById.mockResolvedValue(
      createOneTimeToken({
        id: 'email-token-1',
        usedAt: new Date(),
      }),
    );

    await expect(
      service.verifyEmail({
        token: 'email-token-1.email-secret',
        context,
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('creates a verified OAuth user when no account exists for the provider email', async () => {
    const user = createUser({
      email: 'oauth@example.com',
      emailVerifiedAt: new Date(),
      status: 'active',
    });
    const { repository, service } = createService();

    repository.findOAuthAccount.mockResolvedValue(null);
    repository.findUserByEmail.mockResolvedValue(null);
    repository.createUser.mockResolvedValue(user);
    repository.createOAuthAccount.mockResolvedValue(
      createOAuthAccount({ provider: 'google', userId: user.id }),
    );

    const result = await service.completeOAuthLogin({
      context,
      profile: createOAuthProfile({ email: 'oauth@example.com', provider: 'google' }),
    });

    expect(repository.createUser).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'oauth@example.com',
        status: 'active',
      }),
    );
    expect(repository.createOAuthAccount).toHaveBeenCalledWith(
      expect.objectContaining({ provider: 'google', userId: user.id }),
    );
    if (result.mfaRequired) {
      throw new Error('OAuth login unexpectedly required MFA for a new user');
    }
    expect(result.tokens.accessToken).toBe('access-token');
  });

  it('blocks OAuth login when provider email is unverified', async () => {
    const { service } = createService();

    await expect(
      service.completeOAuthLogin({
        context,
        profile: createOAuthProfile({ emailVerified: false }),
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('does not silently merge OAuth login into an existing password account', async () => {
    const existingUser = createUser({ email: 'existing@example.com' });
    const { repository, service } = createService();

    repository.findOAuthAccount.mockResolvedValue(null);
    repository.findUserByEmail.mockResolvedValue(existingUser);

    await expect(
      service.completeOAuthLogin({
        context,
        profile: createOAuthProfile({ email: 'existing@example.com' }),
      }),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(repository.createOAuthAccount).not.toHaveBeenCalled();
  });

  it('logs in with an already linked OAuth provider and requires MFA when enabled', async () => {
    const user = createUser({
      mfaEnabledAt: new Date(),
      mfaMethod: 'totp',
      mfaSecretEncrypted: 'encrypted-secret',
    });
    const { repository, service } = createService();

    repository.findOAuthAccount.mockResolvedValue(createOAuthAccount({ userId: user.id }));
    repository.findUserById.mockResolvedValue(user);

    const result = await service.completeOAuthLogin({
      context,
      profile: createOAuthProfile(),
    });

    expect(result).toEqual({
      challengeExpiresInSeconds: 300,
      challengeToken: 'mfa-challenge-token',
      mfaRequired: true,
    });
    expect(repository.createSession).not.toHaveBeenCalled();
  });

  it('prevents unlinking the last OAuth provider when no password login exists', async () => {
    const user = createUser({ passwordHash: 'oauth-only:random' });
    const { repository, service } = createService();

    repository.findUserById.mockResolvedValue(user);
    repository.listOAuthAccounts.mockResolvedValue([
      createOAuthAccount({ provider: 'google', userId: user.id }),
    ]);

    await expect(
      service.unlinkOAuthProvider({
        context,
        provider: 'google',
        userId: user.id,
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});

function createService(options: { nodeEnv?: string } = {}) {
  const repository: MockRepository = {
    assignUserRole: jest.fn<Promise<void>, [string]>().mockResolvedValue(undefined),
    createOAuthAccount: jest.fn<Promise<OAuthAccount>, [unknown]>(),
    createEmailVerificationToken: jest
      .fn<Promise<{ id: string }>, [unknown]>()
      .mockResolvedValue({ id: 'email-token-1' }),
    createPasswordResetToken: jest
      .fn<Promise<{ id: string }>, [unknown]>()
      .mockResolvedValue({ id: 'reset-token-1' }),
    createSession: jest
      .fn<Promise<{ id: string }>, [unknown]>()
      .mockResolvedValue({ id: 'session-1' }),
    createUser: jest.fn<Promise<UserOrmEntity>, [unknown]>(),
    deleteOAuthAccount: jest.fn<Promise<void>, [string, string]>().mockResolvedValue(undefined),
    findEmailVerificationTokenById: jest.fn<Promise<OneTimeToken | null>, [string]>(),
    findOAuthAccount: jest.fn<Promise<OAuthAccount | null>, [string, string]>(),
    findPasswordResetTokenById: jest.fn<Promise<OneTimeToken | null>, [string]>(),
    findSessionById: jest.fn<Promise<Session | null>, [string]>(),
    findUserByEmail: jest.fn<Promise<UserOrmEntity | null>, [string]>(),
    findUserById: jest.fn<Promise<UserOrmEntity | null>, [string]>(),
    getPermissionCodes: jest.fn<Promise<[]>, [string]>().mockResolvedValue([]),
    getRoleCodes: jest.fn<Promise<['USER']>, [string]>().mockResolvedValue(['USER']),
    getTenantIds: jest.fn<Promise<[]>, [string]>().mockResolvedValue([]),
    listOAuthAccounts: jest.fn<Promise<OAuthAccount[]>, [string]>().mockResolvedValue([]),
    listSessions: jest.fn<Promise<[]>, [string]>().mockResolvedValue([]),
    markEmailVerificationTokenUsed: jest.fn<Promise<void>, [string]>().mockResolvedValue(undefined),
    markPasswordResetTokenUsed: jest.fn<Promise<void>, [string]>().mockResolvedValue(undefined),
    markUserEmailVerified: jest.fn<Promise<UserOrmEntity | null>, [string]>(),
    recordLogin: jest.fn<Promise<void>, [unknown]>().mockResolvedValue(undefined),
    revokeSession: jest.fn<Promise<void>, [string]>().mockResolvedValue(undefined),
    revokeSessionFamily: jest.fn<Promise<void>, [string]>().mockResolvedValue(undefined),
    revokeUserSessions: jest.fn<Promise<void>, [string]>().mockResolvedValue(undefined),
    rotateSession: jest.fn<Promise<void>, [string, string, Date]>().mockResolvedValue(undefined),
    updateUserMfa: jest.fn<Promise<UserOrmEntity | null>, [unknown]>(),
    updateUserPassword: jest.fn<Promise<void>, [string, string]>().mockResolvedValue(undefined),
  };
  const passwordHasher: MockPasswordHasher = {
    hash: jest
      .fn<Promise<string>, [string]>()
      .mockImplementation((value) => Promise.resolve(`hash:${value}`)),
    verify: jest
      .fn<Promise<boolean>, [string, string]>()
      .mockImplementation((hash, value) => Promise.resolve(hash === `hash:${value}`)),
  };
  const tokenService: MockAuthTokenService = {
    signAccessToken: jest.fn<Promise<string>, []>().mockResolvedValue('access-token'),
    signMfaChallengeToken: jest
      .fn<Promise<string>, [string]>()
      .mockResolvedValue('mfa-challenge-token'),
    signMfaEnrollmentToken: jest
      .fn<Promise<string>, [{ secret: string; userId: string }]>()
      .mockResolvedValue('mfa-enrollment-token'),
    verifyMfaChallengeToken: jest
      .fn<Promise<{ sub: string }>, [string]>()
      .mockResolvedValue({ sub: 'user-1' }),
    verifyMfaEnrollmentToken: jest
      .fn<Promise<{ secret: string; sub: string }>, [string]>()
      .mockResolvedValue({ secret: 'secret', sub: 'user-1' }),
  };
  const authMail: MockAuthMailService = {
    sendEmailVerificationEmail: jest.fn<Promise<void>, [string, string]>().mockResolvedValue(),
    sendPasswordResetEmail: jest.fn<Promise<void>, [string, string]>().mockResolvedValue(),
  };
  const config = {
    get: jest
      .fn<unknown, Parameters<ConfigService['get']>>()
      .mockImplementation((key: string, defaultValue?: unknown) => {
        if (key === 'NODE_ENV') {
          return options.nodeEnv ?? 'local';
        }

        if (key === 'COOKIE_SECRET') {
          return TEST_COOKIE_SECRET;
        }

        return defaultValue ?? '30d';
      }),
    getOrThrow: jest.fn<unknown, [string]>().mockImplementation((key: string) => {
      if (key === 'COOKIE_SECRET') {
        return TEST_COOKIE_SECRET;
      }

      return 'test-secret-value-with-enough-length';
    }),
  };
  const systemParameters = {
    assertLoginEnabled: jest.fn<Promise<void>, []>().mockResolvedValue(undefined),
    assertRegistrationEnabled: jest.fn<Promise<void>, []>().mockResolvedValue(undefined),
  };
  const service = new AuthService(
    repository as never,
    passwordHasher,
    tokenService as never,
    authMail as never,
    config as never,
    systemParameters as never,
  );

  return { authMail, passwordHasher, repository, service, systemParameters, tokenService };
}

function createOneTimeToken(overrides: Partial<OneTimeToken> = {}): OneTimeToken {
  return {
    id: 'token-1',
    userId: 'user-1',
    tokenHash: 'hash:secret',
    expiresAt: new Date(Date.now() + 60_000),
    usedAt: null,
    ...overrides,
  };
}

function createUser(overrides: Partial<UserOrmEntity> = {}): UserOrmEntity {
  return {
    id: 'user-1',
    email: 'user@example.com',
    passwordHash: 'hash:ChangeMe!123456',
    displayName: 'User',
    avatarUrl: null,
    status: 'active',
    emailVerifiedAt: null,
    lockedUntil: null,
    mfaEnabledAt: null,
    mfaMethod: null,
    mfaSecretEncrypted: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    sessions: [],
    ...overrides,
  };
}

function createSession(overrides: Partial<Session> = {}): Session {
  return {
    id: 'session-1',
    userId: 'user-1',
    refreshTokenHash: 'hash:secret',
    refreshTokenFamilyId: 'family-1',
    expiresAt: new Date(Date.now() + 60_000),
    revokedAt: null,
    ...overrides,
  };
}

function createOAuthAccount(overrides: Partial<OAuthAccount> = {}): OAuthAccount {
  return {
    id: 'oauth-account-1',
    provider: 'google',
    providerSubject: 'provider-subject-1',
    userId: 'user-1',
    verifiedEmail: 'user@example.com',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

function createOAuthProfile(overrides: Partial<OAuthProfile> = {}): OAuthProfile {
  return {
    avatarUrl: null,
    displayName: 'OAuth User',
    email: 'user@example.com',
    emailVerified: true,
    provider: 'google',
    providerSubject: 'provider-subject-1',
    ...overrides,
  };
}
