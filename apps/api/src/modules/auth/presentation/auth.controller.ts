import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Public } from '../../../common/decorators/public.decorator';
import type { AuthenticatedUser } from '../../../common/types/authenticated-user';
import { AuthService, REFRESH_TOKEN_COOKIE } from '../application/auth.service';
import type { RequestContext } from '../application/auth.types';
import {
  decodeOAuthState,
  encodeOAuthState,
  validateReturnTo,
} from '../application/oauth-return-to';
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
  @Get('oauth/:provider')
  oauthStart(
    @Param('provider') provider: string,
    @Query('returnTo') returnTo: string | undefined,
    @Res() response: Response,
  ) {
    const safeReturnTo = validateReturnTo(returnTo, this.config.getOrThrow<string>('APP_URL'));
    const redirectUrl = this.buildOAuthRedirectUrl(provider, safeReturnTo);
    return response.redirect(redirectUrl);
  }

  @Public()
  @Get('oauth/:provider/callback')
  oauthCallback(
    @Param('provider') provider: string,
    @Query('state') state: string | undefined,
    @Query('code') code: string | undefined,
  ) {
    const decoded = decodeOAuthState(state, this.config.getOrThrow<string>('APP_URL'));
    if (decoded.provider !== provider || !code) {
      throw new ServiceUnavailableException('OAuth login could not be completed');
    }

    throw new ServiceUnavailableException(
      'OAuth provider credentials are configured, but account linking needs product confirmation before enabling callback exchange',
    );
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

  private buildOAuthRedirectUrl(provider: string, returnTo: string) {
    const state = encodeOAuthState({ provider, returnTo });
    const apiUrl = this.config.getOrThrow<string>('API_URL');

    if (provider === 'google') {
      const clientId = this.config.get<string>('GOOGLE_OAUTH_CLIENT_ID', '');
      if (!clientId) {
        throw new ServiceUnavailableException('Google OAuth is not configured');
      }
      const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      url.searchParams.set('client_id', clientId);
      url.searchParams.set('redirect_uri', `${apiUrl}/api/v1/auth/oauth/google/callback`);
      url.searchParams.set('response_type', 'code');
      url.searchParams.set('scope', 'openid email profile');
      url.searchParams.set('state', state);
      return url.toString();
    }

    if (provider === 'facebook') {
      const clientId = this.config.get<string>('FACEBOOK_OAUTH_CLIENT_ID', '');
      if (!clientId) {
        throw new ServiceUnavailableException('Facebook OAuth is not configured');
      }
      const url = new URL('https://www.facebook.com/v19.0/dialog/oauth');
      url.searchParams.set('client_id', clientId);
      url.searchParams.set('redirect_uri', `${apiUrl}/api/v1/auth/oauth/facebook/callback`);
      url.searchParams.set('response_type', 'code');
      url.searchParams.set('scope', 'email,public_profile');
      url.searchParams.set('state', state);
      return url.toString();
    }

    throw new ServiceUnavailableException('OAuth provider is not supported');
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
