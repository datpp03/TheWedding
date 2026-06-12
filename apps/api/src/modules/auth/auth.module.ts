import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from '../users/infrastructure/user.orm-entity';
import { AuthService } from './application/auth.service';
import { AuthTokenService } from './application/auth-token.service';
import { Argon2PasswordHasher } from './infrastructure/argon2-password-hasher';
import { TypeOrmAuthRepository } from './infrastructure/typeorm-auth.repository';
import { UserLoginHistoryOrmEntity } from './infrastructure/user-login-history.orm-entity';
import { UserSessionOrmEntity } from './infrastructure/user-session.orm-entity';
import { AccessTokenGuard } from './presentation/access-token.guard';
import { AuthController } from './presentation/auth.controller';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([UserOrmEntity, UserSessionOrmEntity, UserLoginHistoryOrmEntity]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthTokenService,
    Argon2PasswordHasher,
    TypeOrmAuthRepository,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
  exports: [AuthService, AuthTokenService],
})
export class AuthModule {}
