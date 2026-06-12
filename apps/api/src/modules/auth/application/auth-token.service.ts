import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { AuthenticatedUser } from '../../../common/types/authenticated-user';
import type { AccessTokenPayload } from './auth.types';

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
}
