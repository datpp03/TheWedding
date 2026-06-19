import {
  ConflictException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { UserOrmEntity } from '../../users/infrastructure/user.orm-entity';
import type { Argon2PasswordHasher } from '../infrastructure/argon2-password-hasher';
import { AuthService } from './auth.service';

type MockRepository = {
  assignUserRole: jest.MockedFunction<(userId: string) => Promise<void>>;
  createEmailVerificationToken: jest.MockedFunction<(input: unknown) => Promise<{ id: string }>>;
  createPasswordResetToken: jest.MockedFunction<(input: unknown) => Promise<{ id: string }>>;
  createSession: jest.MockedFunction<(input: unknown) => Promise<{ id: string }>>;
  createUser: jest.MockedFunction<(input: unknown) => Promise<UserOrmEntity>>;
  findEmailVerificationTokenById: jest.MockedFunction<(id: string) => Promise<OneTimeToken | null>>;
  findPasswordResetTokenById: jest.MockedFunction<(id: string) => Promise<OneTimeToken | null>>;
  findSessionById: jest.MockedFunction<(id: string) => Promise<Session | null>>;
  findUserByEmail: jest.MockedFunction<(email: string) => Promise<UserOrmEntity | null>>;
  findUserById: jest.MockedFunction<(id: string) => Promise<UserOrmEntity | null>>;
  getPermissionCodes: jest.MockedFunction<(userId: string) => Promise<[]>>;
  getRoleCodes: jest.MockedFunction<(userId: string) => Promise<['USER']>>;
  getTenantIds: jest.MockedFunction<(userId: string) => Promise<[]>>;
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
  updateUserPassword: jest.MockedFunction<(userId: string, passwordHash: string) => Promise<void>>;
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

const context = {
  ipAddress: '127.0.0.1',
  userAgent: 'jest',
};

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
});

function createService() {
  const repository: MockRepository = {
    assignUserRole: jest.fn<Promise<void>, [string]>().mockResolvedValue(undefined),
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
    findEmailVerificationTokenById: jest.fn<Promise<OneTimeToken | null>, [string]>(),
    findPasswordResetTokenById: jest.fn<Promise<OneTimeToken | null>, [string]>(),
    findSessionById: jest.fn<Promise<Session | null>, [string]>(),
    findUserByEmail: jest.fn<Promise<UserOrmEntity | null>, [string]>(),
    findUserById: jest.fn<Promise<UserOrmEntity | null>, [string]>(),
    getPermissionCodes: jest.fn<Promise<[]>, [string]>().mockResolvedValue([]),
    getRoleCodes: jest.fn<Promise<['USER']>, [string]>().mockResolvedValue(['USER']),
    getTenantIds: jest.fn<Promise<[]>, [string]>().mockResolvedValue([]),
    listSessions: jest.fn<Promise<[]>, [string]>().mockResolvedValue([]),
    markEmailVerificationTokenUsed: jest.fn<Promise<void>, [string]>().mockResolvedValue(undefined),
    markPasswordResetTokenUsed: jest.fn<Promise<void>, [string]>().mockResolvedValue(undefined),
    markUserEmailVerified: jest.fn<Promise<UserOrmEntity | null>, [string]>(),
    recordLogin: jest.fn<Promise<void>, [unknown]>().mockResolvedValue(undefined),
    revokeSession: jest.fn<Promise<void>, [string]>().mockResolvedValue(undefined),
    revokeSessionFamily: jest.fn<Promise<void>, [string]>().mockResolvedValue(undefined),
    revokeUserSessions: jest.fn<Promise<void>, [string]>().mockResolvedValue(undefined),
    rotateSession: jest.fn<Promise<void>, [string, string, Date]>().mockResolvedValue(undefined),
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
  const tokenService = {
    signAccessToken: jest.fn<Promise<string>, []>().mockResolvedValue('access-token'),
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
          return 'local';
        }

        return defaultValue ?? '30d';
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

  return { authMail, passwordHasher, repository, service, systemParameters };
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
