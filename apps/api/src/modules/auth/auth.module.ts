import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { SettingsModule } from '../settings/settings.module';
import { UserOrmEntity } from '../users/infrastructure/user.orm-entity';
import { AuthService } from './application/auth.service';
import { AuthMailService } from './application/auth-mail.service';
import { AuthTokenService } from './application/auth-token.service';
import { Argon2PasswordHasher } from './infrastructure/argon2-password-hasher';
import { EmailVerificationTokenOrmEntity } from './infrastructure/email-verification-token.orm-entity';
import { OAuthAccountOrmEntity } from './infrastructure/oauth-account.orm-entity';
import { PasswordResetTokenOrmEntity } from './infrastructure/password-reset-token.orm-entity';
import { TypeOrmAuthRepository } from './infrastructure/typeorm-auth.repository';
import { UserLoginHistoryOrmEntity } from './infrastructure/user-login-history.orm-entity';
import { UserSessionOrmEntity } from './infrastructure/user-session.orm-entity';
import { AccessTokenGuard } from './presentation/access-token.guard';
import { AuthController } from './presentation/auth.controller';

@Module({
  imports: [
    AuditLogsModule,
    SettingsModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([
      UserOrmEntity,
      UserSessionOrmEntity,
      UserLoginHistoryOrmEntity,
      OAuthAccountOrmEntity,
      PasswordResetTokenOrmEntity,
      EmailVerificationTokenOrmEntity,
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthMailService,
    AuthTokenService,
    Argon2PasswordHasher,
    TypeOrmAuthRepository,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
  exports: [AuthService, AuthTokenService],
})
export class AuthModule {}
