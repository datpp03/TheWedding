import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { UserOrmEntity } from '../../users/infrastructure/user.orm-entity';
import type { Argon2PasswordHasher } from '../infrastructure/argon2-password-hasher';
import { AuthService } from './auth.service';

type MockRepository = {
  assignUserRole: jest.MockedFunction<(userId: string) => Promise<void>>;
  createSession: jest.MockedFunction<(input: unknown) => Promise<{ id: string }>>;
  createUser: jest.MockedFunction<(input: unknown) => Promise<UserOrmEntity>>;
  findSessionById: jest.MockedFunction<(id: string) => Promise<Session | null>>;
  findUserByEmail: jest.MockedFunction<(email: string) => Promise<UserOrmEntity | null>>;
  findUserById: jest.MockedFunction<(id: string) => Promise<UserOrmEntity | null>>;
  getPermissionCodes: jest.MockedFunction<(userId: string) => Promise<[]>>;
  getRoleCodes: jest.MockedFunction<(userId: string) => Promise<['USER']>>;
  getTenantIds: jest.MockedFunction<(userId: string) => Promise<[]>>;
  listSessions: jest.MockedFunction<(userId: string) => Promise<[]>>;
  recordLogin: jest.MockedFunction<(input: unknown) => Promise<void>>;
  revokeSession: jest.MockedFunction<(sessionId: string) => Promise<void>>;
  revokeSessionFamily: jest.MockedFunction<(familyId: string) => Promise<void>>;
  rotateSession: jest.MockedFunction<
    (sessionId: string, refreshTokenHash: string, expiresAt: Date) => Promise<void>
  >;
};

type Session = {
  id: string;
  userId: string;
  refreshTokenHash: string;
  refreshTokenFamilyId: string;
  expiresAt: Date;
  revokedAt: Date | null;
};

type MockPasswordHasher = {
  hash: jest.MockedFunction<Argon2PasswordHasher['hash']>;
  verify: jest.MockedFunction<Argon2PasswordHasher['verify']>;
};

const context = {
  ipAddress: '127.0.0.1',
  userAgent: 'jest',
};

describe(AuthService.name, () => {
  it('registers a user, assigns USER role, and issues tokens', async () => {
    const user = createUser({ email: 'new@example.com' });
    const { repository, service } = createService();

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
    expect(result.user.email).toBe('new@example.com');
    expect(result.tokens.accessToken).toBe('access-token');
    expect(result.tokens.refreshToken).toMatch(/^session-1\./);
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
});

function createService() {
  const repository: MockRepository = {
    assignUserRole: jest.fn<Promise<void>, [string]>().mockResolvedValue(undefined),
    createSession: jest
      .fn<Promise<{ id: string }>, [unknown]>()
      .mockResolvedValue({ id: 'session-1' }),
    createUser: jest.fn<Promise<UserOrmEntity>, [unknown]>(),
    findSessionById: jest.fn<Promise<Session | null>, [string]>(),
    findUserByEmail: jest.fn<Promise<UserOrmEntity | null>, [string]>(),
    findUserById: jest.fn<Promise<UserOrmEntity | null>, [string]>(),
    getPermissionCodes: jest.fn<Promise<[]>, [string]>().mockResolvedValue([]),
    getRoleCodes: jest.fn<Promise<['USER']>, [string]>().mockResolvedValue(['USER']),
    getTenantIds: jest.fn<Promise<[]>, [string]>().mockResolvedValue([]),
    listSessions: jest.fn<Promise<[]>, [string]>().mockResolvedValue([]),
    recordLogin: jest.fn<Promise<void>, [unknown]>().mockResolvedValue(undefined),
    revokeSession: jest.fn<Promise<void>, [string]>().mockResolvedValue(undefined),
    revokeSessionFamily: jest.fn<Promise<void>, [string]>().mockResolvedValue(undefined),
    rotateSession: jest.fn<Promise<void>, [string, string, Date]>().mockResolvedValue(undefined),
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
  const config = {
    get: jest.fn<unknown, Parameters<ConfigService['get']>>().mockReturnValue('30d'),
  };
  const service = new AuthService(
    repository as never,
    passwordHasher,
    tokenService as never,
    config as never,
  );

  return { passwordHasher, repository, service };
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
