import { Injectable, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type OAuthProvider = 'google' | 'facebook';

export type OAuthProfile = {
  provider: OAuthProvider;
  providerSubject: string;
  email: string | null;
  emailVerified: boolean;
  displayName: string;
  avatarUrl: string | null;
};

@Injectable()
export class OAuthProviderService {
  constructor(private readonly config: ConfigService) {}

  getEnabledProviders() {
    return {
      facebook: this.isProviderEnabled('facebook'),
      google: this.isProviderEnabled('google'),
    };
  }

  buildAuthorizationUrl(input: {
    provider: OAuthProvider;
    redirectUri: string;
    state: string;
  }): string {
    if (!this.isProviderEnabled(input.provider)) {
      throw new ServiceUnavailableException(`${input.provider} OAuth is not enabled`);
    }

    if (input.provider === 'google') {
      const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      url.searchParams.set('client_id', this.getRequiredConfig('GOOGLE_OAUTH_CLIENT_ID'));
      url.searchParams.set('redirect_uri', input.redirectUri);
      url.searchParams.set('response_type', 'code');
      url.searchParams.set('scope', 'openid email profile');
      url.searchParams.set('state', input.state);
      url.searchParams.set('access_type', 'online');
      url.searchParams.set('prompt', 'select_account');
      return url.toString();
    }

    const url = new URL('https://www.facebook.com/v19.0/dialog/oauth');
    url.searchParams.set('client_id', this.getRequiredConfig('FACEBOOK_OAUTH_CLIENT_ID'));
    url.searchParams.set('redirect_uri', input.redirectUri);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', 'email,public_profile');
    url.searchParams.set('state', input.state);
    return url.toString();
  }

  async exchangeCodeForProfile(input: {
    provider: OAuthProvider;
    code: string;
    redirectUri: string;
  }): Promise<OAuthProfile> {
    if (!this.isProviderEnabled(input.provider)) {
      throw new ServiceUnavailableException(`${input.provider} OAuth is not enabled`);
    }

    if (input.provider === 'google') {
      return this.exchangeGoogleCode(input.code, input.redirectUri);
    }

    return this.exchangeFacebookCode(input.code, input.redirectUri);
  }

  isSupportedProvider(provider: string): provider is OAuthProvider {
    return provider === 'google' || provider === 'facebook';
  }

  private isProviderEnabled(provider: OAuthProvider) {
    if (provider === 'google') {
      return (
        this.config.get<boolean>('GOOGLE_OAUTH_ENABLED', false) &&
        Boolean(this.config.get<string>('GOOGLE_OAUTH_CLIENT_ID')) &&
        Boolean(this.config.get<string>('GOOGLE_OAUTH_CLIENT_SECRET'))
      );
    }

    return (
      this.config.get<boolean>('FACEBOOK_OAUTH_ENABLED', false) &&
      Boolean(this.config.get<string>('FACEBOOK_OAUTH_CLIENT_ID')) &&
      Boolean(this.config.get<string>('FACEBOOK_OAUTH_CLIENT_SECRET'))
    );
  }

  private async exchangeGoogleCode(code: string, redirectUri: string): Promise<OAuthProfile> {
    const tokenPayload = await postForm<{ access_token?: string }>(
      'https://oauth2.googleapis.com/token',
      {
        client_id: this.getRequiredConfig('GOOGLE_OAUTH_CLIENT_ID'),
        client_secret: this.getRequiredConfig('GOOGLE_OAUTH_CLIENT_SECRET'),
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      },
    );

    if (!tokenPayload.access_token) {
      throw new UnauthorizedException('Google OAuth did not return an access token');
    }

    const profile = await getJson<{
      email?: string;
      email_verified?: boolean;
      name?: string;
      picture?: string;
      sub?: string;
    }>('https://www.googleapis.com/oauth2/v3/userinfo', tokenPayload.access_token);

    if (!profile.sub) {
      throw new UnauthorizedException('Google OAuth profile is missing an account id');
    }

    return {
      provider: 'google',
      providerSubject: profile.sub,
      email: profile.email?.toLowerCase() ?? null,
      emailVerified: profile.email_verified === true,
      displayName: profile.name?.trim() || profile.email || 'Google user',
      avatarUrl: profile.picture ?? null,
    };
  }

  private async exchangeFacebookCode(code: string, redirectUri: string): Promise<OAuthProfile> {
    const url = new URL('https://graph.facebook.com/v19.0/oauth/access_token');
    url.searchParams.set('client_id', this.getRequiredConfig('FACEBOOK_OAUTH_CLIENT_ID'));
    url.searchParams.set('client_secret', this.getRequiredConfig('FACEBOOK_OAUTH_CLIENT_SECRET'));
    url.searchParams.set('code', code);
    url.searchParams.set('redirect_uri', redirectUri);

    const tokenPayload = await getJson<{ access_token?: string }>(url.toString());

    if (!tokenPayload.access_token) {
      throw new UnauthorizedException('Facebook OAuth did not return an access token');
    }

    const profile = await getJson<{
      email?: string;
      id?: string;
      name?: string;
      picture?: { data?: { url?: string } };
    }>('https://graph.facebook.com/me?fields=id,name,email,picture', tokenPayload.access_token);

    if (!profile.id) {
      throw new UnauthorizedException('Facebook OAuth profile is missing an account id');
    }

    return {
      provider: 'facebook',
      providerSubject: profile.id,
      email: profile.email?.toLowerCase() ?? null,
      emailVerified: Boolean(profile.email),
      displayName: profile.name?.trim() || profile.email || 'Facebook user',
      avatarUrl: profile.picture?.data?.url ?? null,
    };
  }

  private getRequiredConfig(key: string) {
    const value = this.config.get<string>(key, '');
    if (!value) {
      throw new ServiceUnavailableException(`${key} is not configured`);
    }
    return value;
  }
}

async function postForm<TPayload>(url: string, body: Record<string, string>): Promise<TPayload> {
  const response = await fetch(url, {
    body: new URLSearchParams(body),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'POST',
  });

  return parseProviderResponse<TPayload>(response);
}

async function getJson<TPayload>(url: string, accessToken?: string): Promise<TPayload> {
  const headers: Record<string, string> = accessToken
    ? { Authorization: `Bearer ${accessToken}` }
    : {};
  const response = await fetch(url, { headers });

  return parseProviderResponse<TPayload>(response);
}

async function parseProviderResponse<TPayload>(response: Response): Promise<TPayload> {
  const payload = (await response.json().catch(() => null)) as TPayload | null;

  if (!response.ok || !payload) {
    throw new UnauthorizedException('OAuth provider request failed');
  }

  return payload;
}
