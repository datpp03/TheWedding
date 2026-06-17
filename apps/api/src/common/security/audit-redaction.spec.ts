import { redactSensitiveMetadata } from './audit-redaction';

describe(redactSensitiveMetadata.name, () => {
  it('redacts nested secrets while preserving safe operational fields', () => {
    const redacted = redactSensitiveMetadata({
      action: 'auth.oauth_callback',
      authorizationCode: 'oauth-code',
      nested: {
        cookie: 'refresh_token=secret',
        statusCode: 401,
      },
      password: 'ChangeMe!123',
      token: 'jwt',
    });

    expect(redacted).toEqual({
      action: 'auth.oauth_callback',
      authorizationCode: '[REDACTED]',
      nested: {
        cookie: '[REDACTED]',
        statusCode: 401,
      },
      password: '[REDACTED]',
      token: '[REDACTED]',
    });
  });
});
