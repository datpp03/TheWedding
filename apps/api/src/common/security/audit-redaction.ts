const REDACTED = '[REDACTED]';

const SENSITIVE_KEY_PATTERNS = [
  /authorization/i,
  /cookie/i,
  /password/i,
  /secret/i,
  /token/i,
  /otp/i,
  /mfa/i,
  /code/i,
  /providerSecret/i,
  /accessKey/i,
];

const SAFE_CODE_KEYS = new Set(['code', 'statusCode', 'errorCode']);

export function redactSensitiveMetadata<T>(value: T): T {
  return redactValue(value) as T;
}

function redactValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => redactValue(item));
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, entryValue]) => [
      key,
      shouldRedactKey(key) ? REDACTED : redactValue(entryValue),
    ]),
  );
}

function shouldRedactKey(key: string) {
  if (SAFE_CODE_KEYS.has(key)) {
    return false;
  }

  return SENSITIVE_KEY_PATTERNS.some((pattern) => pattern.test(key));
}
