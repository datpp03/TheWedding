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
import {
  ACCESS_TOKEN_COOKIE,
  AuthService,
  MFA_CHALLENGE_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from '../application/auth.service';
import type { RequestContext } from '../application/auth.types';
import { AuthTokenService } from '../application/auth-token.service';
import { OAuthProviderService } from '../application/oauth-provider.service';
import {
  decodeOAuthState,
  encodeOAuthState,
  validateReturnTo,
} from '../application/oauth-return-to';
import {
  clearAuthCookies,
  clearMfaChallengeCookie,
  setAuthCookies,
  setCsrfCookie,
  setMfaChallengeCookie,
} from './auth-cookie.presenter';
import {
  DisableMfaDto,
  ForgotPasswordDto,
  LoginDto,
  MfaChallengeDto,
  RefreshDto,
  RegisterDto,
  ResendVerificationDto,
  ResetPasswordDto,
  VerifyMfaEnrollmentDto,
  VerifyEmailDto,
} from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authTokenService: AuthTokenService,
    private readonly config: ConfigService,
    private readonly oauthProviders: OAuthProviderService,
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
        'mfa-totp',
        'oauth-google',
        'oauth-facebook',
        'logout',
        'refresh',
        'forgot-password',
        'resend-verification',
        'reset-password',
        'verify-email',
        'csrf',
        'sessions',
      ],
      oauthProviders: this.oauthProviders.getEnabledProviders(),
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
    setCsrfCookie(response, this.authService.createCsrfToken(), this.config);

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
  @Post('resend-verification')
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  resendVerification(@Body() body: ResendVerificationDto, @Req() request: Request) {
    return this.authService.resendEmailVerification({
      email: body.email,
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

    if (isMfaRequired(result)) {
      setMfaChallengeCookie(response, result.challengeToken, this.config);
      return {
        challengeExpiresInSeconds: result.challengeExpiresInSeconds,
        mfaRequired: true,
      };
    }

    setAuthCookies(response, result.tokens, this.config);
    setCsrfCookie(response, this.authService.createCsrfToken(), this.config);

    return {
      user: result.user,
    };
  }

  @Public()
  @Get('oauth/:provider')
  async oauthStart(
    @Param('provider') provider: string,
    @Query('returnTo') returnTo: string | undefined,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    if (!this.oauthProviders.isSupportedProvider(provider)) {
      throw new ServiceUnavailableException('OAuth provider is not supported');
    }

    const safeReturnTo = validateReturnTo(returnTo, this.config.getOrThrow<string>('APP_URL'));
    await this.authService.recordOAuthStart({
      context: getRequestContext(request),
      mode: 'login',
      provider,
      returnTo: safeReturnTo,
    });
    const redirectUrl = this.buildOAuthRedirectUrl(provider, safeReturnTo, 'login');
    return response.redirect(redirectUrl);
  }

  @Get('oauth/link/:provider')
  async oauthLinkStart(
    @CurrentUser() user: AuthenticatedUser,
    @Param('provider') provider: string,
    @Query('returnTo') returnTo: string | undefined,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    if (!this.oauthProviders.isSupportedProvider(provider)) {
      throw new ServiceUnavailableException('OAuth provider is not supported');
    }

    const safeReturnTo = validateReturnTo(
      returnTo ?? '/dashboard/settings',
      this.config.getOrThrow<string>('APP_URL'),
    );
    await this.authService.recordOAuthStart({
      actorUserId: user.id,
      context: getRequestContext(request),
      mode: 'link',
      provider,
      returnTo: safeReturnTo,
    });
    const redirectUrl = this.buildOAuthRedirectUrl(provider, safeReturnTo, 'link', user.id);
    return response.redirect(redirectUrl);
  }

  @Public()
  @Get('oauth/:provider/callback')
  async oauthCallback(
    @Param('provider') provider: string,
    @Query('state') state: string | undefined,
    @Query('code') code: string | undefined,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    if (!this.oauthProviders.isSupportedProvider(provider)) {
      throw new ServiceUnavailableException('OAuth provider is not supported');
    }

    const decoded = decodeOAuthState(
      state,
      this.config.getOrThrow<string>('APP_URL'),
      this.getOAuthStateSecret(),
    );
    if (decoded.provider !== provider || !code) {
      throw new ServiceUnavailableException('OAuth login could not be completed');
    }

    const redirectUri = this.buildOAuthCallbackUrl(provider);
    const profile = await this.oauthProviders.exchangeCodeForProfile({
      code,
      provider,
      redirectUri,
    });

    if (decoded.mode === 'link') {
      const authenticatedUser = await this.readUserFromAccessCookie(request);
      if (!decoded.userId || authenticatedUser.id !== decoded.userId) {
        throw new ServiceUnavailableException('OAuth account linking session expired');
      }

      await this.authService.linkOAuthProvider({
        context: getRequestContext(request),
        profile,
        userId: authenticatedUser.id,
      });

      return response.redirect(this.buildAppRedirectUrl(decoded.returnTo));
    }

    const result = await this.authService.completeOAuthLogin({
      context: getRequestContext(request),
      profile,
    });

    if (isMfaRequired(result)) {
      setMfaChallengeCookie(response, result.challengeToken, this.config);
      const loginUrl = new URL('/login', this.config.getOrThrow<string>('APP_URL'));
      loginUrl.searchParams.set('mfa', 'required');
      loginUrl.searchParams.set('redirect', decoded.returnTo);
      return response.redirect(loginUrl.toString());
    }

    setAuthCookies(response, result.tokens, this.config);
    setCsrfCookie(response, this.authService.createCsrfToken(), this.config);
    return response.redirect(this.buildAppRedirectUrl(decoded.returnTo));
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
    setCsrfCookie(response, this.authService.createCsrfToken(), this.config);

    return {
      user: result.user,
    };
  }

  private buildOAuthRedirectUrl(
    provider: 'facebook' | 'google',
    returnTo: string,
    mode: 'link' | 'login',
    userId?: string,
  ) {
    const state = encodeOAuthState(
      { mode, provider, returnTo, userId },
      this.getOAuthStateSecret(),
    );

    return this.oauthProviders.buildAuthorizationUrl({
      provider,
      redirectUri: this.buildOAuthCallbackUrl(provider),
      state,
    });
  }

  private buildOAuthCallbackUrl(provider: 'facebook' | 'google') {
    const apiUrl = this.config.getOrThrow<string>('API_URL');
    return `${apiUrl}/api/v1/auth/oauth/${provider}/callback`;
  }

  private getOAuthStateSecret() {
    return this.config.getOrThrow<string>('COOKIE_SECRET');
  }

  private buildAppRedirectUrl(returnTo: string) {
    return new URL(returnTo, this.config.getOrThrow<string>('APP_URL')).toString();
  }

  private async readUserFromAccessCookie(request: Request): Promise<AuthenticatedUser> {
    const cookies = request.cookies as Record<string, string | undefined> | undefined;
    return this.authTokenService.verifyAccessToken(cookies?.[ACCESS_TOKEN_COOKIE] ?? '');
  }

  @Post('mfa/enrollment/start')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  startMfaEnrollment(@CurrentUser() user: AuthenticatedUser, @Req() request: Request) {
    return this.authService.startMfaEnrollment(user.id, getRequestContext(request));
  }

  @Post('mfa/enrollment/verify')
  @Throttle({ default: { limit: 8, ttl: 60_000 } })
  verifyMfaEnrollment(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: VerifyMfaEnrollmentDto,
    @Req() request: Request,
  ) {
    return this.authService.verifyMfaEnrollment({
      code: body.code,
      context: getRequestContext(request),
      enrollmentToken: body.enrollmentToken,
      userId: user.id,
    });
  }

  @Public()
  @Post('mfa/challenge')
  @Throttle({ default: { limit: 8, ttl: 60_000 } })
  async completeMfaChallenge(
    @Body() body: MfaChallengeDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.completeMfaChallenge({
      challengeToken: readMfaChallengeToken(request, body.challengeToken),
      code: body.code,
      context: getRequestContext(request),
    });

    clearMfaChallengeCookie(response, this.config);
    setAuthCookies(response, result.tokens, this.config);
    setCsrfCookie(response, this.authService.createCsrfToken(), this.config);

    return {
      user: result.user,
    };
  }

  @Delete('mfa')
  @Throttle({ default: { limit: 8, ttl: 60_000 } })
  disableMfa(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: DisableMfaDto,
    @Req() request: Request,
  ) {
    return this.authService.disableMfa({
      code: body.code,
      context: getRequestContext(request),
      userId: user.id,
    });
  }

  @Get('oauth/linked/accounts')
  oauthAccounts(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.listOAuthAccounts(user.id);
  }

  @Delete('oauth/linked/:provider')
  unlinkOAuthProvider(
    @CurrentUser() user: AuthenticatedUser,
    @Param('provider') provider: string,
    @Req() request: Request,
  ) {
    if (!this.oauthProviders.isSupportedProvider(provider)) {
      throw new ServiceUnavailableException('OAuth provider is not supported');
    }

    return this.authService.unlinkOAuthProvider({
      context: getRequestContext(request),
      provider,
      userId: user.id,
    });
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

function readMfaChallengeToken(request: Request, fallback?: string) {
  const cookies = request.cookies as Record<string, string | undefined> | undefined;
  return cookies?.[MFA_CHALLENGE_COOKIE] ?? fallback;
}

function isMfaRequired(result: {
  challengeExpiresInSeconds?: number;
  challengeToken?: string;
  mfaRequired?: boolean;
}): result is {
  challengeExpiresInSeconds: number;
  challengeToken: string;
  mfaRequired: true;
} {
  return result.mfaRequired === true;
}
