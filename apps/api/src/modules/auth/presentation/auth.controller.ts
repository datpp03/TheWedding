import { Body, Controller, Delete, Get, Param, Post, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Public } from '../../../common/decorators/public.decorator';
import type { AuthenticatedUser } from '../../../common/types/authenticated-user';
import { AuthService, REFRESH_TOKEN_COOKIE } from '../application/auth.service';
import type { RequestContext } from '../application/auth.types';
import { clearAuthCookies, setAuthCookies, setCsrfCookie } from './auth-cookie.presenter';
import {
  ForgotPasswordDto,
  LoginDto,
  RefreshDto,
  RegisterDto,
  ResetPasswordDto,
  VerifyEmailDto,
} from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Public()
  @Get('capabilities')
  capabilities() {
    return {
      module: 'auth',
      phase: '2-completed',
      capabilities: [
        'register',
        'login',
        'logout',
        'refresh',
        'forgot-password',
        'reset-password',
        'verify-email',
        'csrf',
        'sessions',
      ],
    };
  }

  @Public()
  @Get('csrf')
  csrf(@Res({ passthrough: true }) response: Response) {
    const token = this.authService.createCsrfToken();
    setCsrfCookie(response, token, this.config);

    return { token };
  }

  @Public()
  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async register(
    @Body() body: RegisterDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.register({
      email: body.email,
      password: body.password,
      displayName: body.displayName,
      context: getRequestContext(request),
    });

    setAuthCookies(response, result.tokens, this.config);

    return {
      devEmailVerificationToken: result.devEmailVerificationToken,
      user: result.user,
    };
  }

  @Public()
  @Post('forgot-password')
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  forgotPassword(@Body() body: ForgotPasswordDto, @Req() request: Request) {
    return this.authService.forgotPassword({
      email: body.email,
      context: getRequestContext(request),
    });
  }

  @Public()
  @Post('reset-password')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async resetPassword(@Body() body: ResetPasswordDto, @Req() request: Request) {
    await this.authService.resetPassword({
      token: body.token,
      password: body.password,
      context: getRequestContext(request),
    });

    return { reset: true };
  }

  @Public()
  @Post('verify-email')
  verifyEmail(@Body() body: VerifyEmailDto, @Req() request: Request) {
    return this.authService.verifyEmail({
      token: body.token,
      context: getRequestContext(request),
    });
  }

  @Public()
  @Post('login')
  @Throttle({ default: { limit: 8, ttl: 60_000 } })
  async login(
    @Body() body: LoginDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login({
      email: body.email,
      password: body.password,
      context: getRequestContext(request),
    });

    setAuthCookies(response, result.tokens, this.config);

    return {
      user: result.user,
    };
  }

  @Public()
  @Post('refresh')
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  async refresh(
    @Body() body: RefreshDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.refresh(
      readRefreshToken(request, body.refreshToken),
      getRequestContext(request),
    );

    setAuthCookies(response, result.tokens, this.config);

    return {
      user: result.user,
    };
  }

  @Public()
  @Post('logout')
  async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    await this.authService.logout(readRefreshToken(request), getRequestContext(request));
    clearAuthCookies(response, this.config);

    return {
      loggedOut: true,
    };
  }

  @Get('me')
  me(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.getCurrentUser(user.id);
  }

  @Get('sessions')
  sessions(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.listSessions(user.id);
  }

  @Delete('sessions/:sessionId')
  async revokeSession(
    @CurrentUser() user: AuthenticatedUser,
    @Param('sessionId') sessionId: string,
    @Req() request: Request,
  ) {
    await this.authService.revokeSession(user.id, sessionId, getRequestContext(request));

    return {
      revoked: true,
    };
  }

  @Delete('sessions')
  async revokeAllSessions(
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.revokeAllSessions(user.id, getRequestContext(request));
    clearAuthCookies(response, this.config);

    return {
      revoked: true,
    };
  }
}

function getRequestContext(request: Request): RequestContext {
  return {
    ipAddress: request.ip,
    userAgent: request.headers['user-agent'],
  };
}

function readRefreshToken(request: Request, fallback?: string) {
  const cookies = request.cookies as Record<string, string | undefined> | undefined;
  return cookies?.[REFRESH_TOKEN_COOKIE] ?? fallback;
}
