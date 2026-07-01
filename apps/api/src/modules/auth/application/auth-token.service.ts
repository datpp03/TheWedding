import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { AuthenticatedUser } from '../../../common/types/authenticated-user';
import type {
  AccessTokenPayload,
  MfaChallengeTokenPayload,
  MfaEnrollmentTokenPayload,
} from './auth.types';

@Injectable()
export class AuthTokenService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}

  signAccessToken(payload: AccessTokenPayload): Promise<string> {
    const expiresIn = this.config.get<string>(
      'ACCESS_TOKEN_EXPIRES_IN',
      '15m',
    ) as `${number}${'s' | 'm' | 'h' | 'd'}`;

    return this.jwt.signAsync(payload, {
      expiresIn,
      secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
    });
  }

  async verifyAccessToken(token: string): Promise<AuthenticatedUser> {
    try {
      const payload = await this.jwt.verifyAsync<AccessTokenPayload>(token, {
        secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
      });

      return {
        id: payload.sub,
        email: payload.email,
        sessionId: payload.sessionId,
        roles: payload.roles,
        permissions: payload.permissions,
        tenantIds: payload.tenantIds,
      };
    } catch {
      throw new UnauthorizedException('Authentication required');
    }
  }

  signMfaChallengeToken(userId: string): Promise<string> {
    return this.jwt.signAsync(
      {
        purpose: 'mfa_challenge',
        sub: userId,
      } satisfies MfaChallengeTokenPayload,
      {
        expiresIn: '5m',
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      },
    );
  }

  async verifyMfaChallengeToken(token: string): Promise<MfaChallengeTokenPayload> {
    try {
      const payload = await this.jwt.verifyAsync<MfaChallengeTokenPayload>(token, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });

      if (payload.purpose !== 'mfa_challenge') {
        throw new Error('Invalid MFA challenge purpose');
      }

      return payload;
    } catch {
      throw new UnauthorizedException('MFA challenge has expired or is invalid');
    }
  }

  signMfaEnrollmentToken(input: { secret: string; userId: string }): Promise<string> {
    return this.jwt.signAsync(
      {
        purpose: 'mfa_enrollment',
        secret: input.secret,
        sub: input.userId,
      } satisfies MfaEnrollmentTokenPayload,
      {
        expiresIn: '10m',
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      },
    );
  }

  async verifyMfaEnrollmentToken(token: string): Promise<MfaEnrollmentTokenPayload> {
    try {
      const payload = await this.jwt.verifyAsync<MfaEnrollmentTokenPayload>(token, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });

      if (payload.purpose !== 'mfa_enrollment') {
        throw new Error('Invalid MFA enrollment purpose');
      }

      return payload;
    } catch {
      throw new UnauthorizedException('MFA enrollment has expired or is invalid');
    }
  }
}
