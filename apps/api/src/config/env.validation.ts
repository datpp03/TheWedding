import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['local', 'development', 'staging', 'production', 'test']).default('local'),
  PORT: z.coerce.number().int().positive().default(4000),
  APP_URL: z.string().url(),
  API_URL: z.string().url(),
  DATABASE_URL: z.string().min(1),
  DATABASE_SSL: z.enum(['auto', 'true', 'false']).default('auto'),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  ACCESS_TOKEN_EXPIRES_IN: z.string().default('15m'),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('30d'),
  PASSWORD_RESET_TOKEN_EXPIRES_IN: z.string().default('1h'),
  EMAIL_VERIFICATION_TOKEN_EXPIRES_IN: z.string().default('7d'),
  COOKIE_SECRET: z.string().min(32),
  COOKIE_DOMAIN: z.string().optional().default(''),
  CORS_ORIGINS: z.string().min(1),
  STORAGE_PROVIDER: z.enum(['local', 's3', 'azure', 'r2']).default('local'),
  LOCAL_STORAGE_PATH: z.string().default('./storage'),
  TENANT_STORAGE_QUOTA_BYTES: z.coerce
    .number()
    .int()
    .positive()
    .default(1024 * 1024 * 1024),
  S3_ENDPOINT: z.string().optional().default(''),
  S3_REGION: z.string().optional().default(''),
  S3_BUCKET: z.string().optional().default(''),
  S3_ACCESS_KEY: z.string().optional().default(''),
  S3_SECRET_KEY: z.string().optional().default(''),
  STORAGE_PUBLIC_BASE_URL: z.string().optional().default(''),
  STORAGE_SIGNED_URL_TTL_SECONDS: z.coerce.number().int().positive().default(900),
  MAX_UPLOAD_BYTES: z.coerce
    .number()
    .int()
    .positive()
    .default(80 * 1024 * 1024),
  MAX_VIDEO_UPLOAD_BYTES: z.coerce
    .number()
    .int()
    .positive()
    .default(600 * 1024 * 1024),
  REDIS_URL: z.string().optional().default(''),
  MEDIA_PROCESSING_CONCURRENCY: z.coerce.number().int().positive().default(2),
  MAIL_PROVIDER: z.string().default('smtp'),
  SMTP_HOST: z.string().optional().default('localhost'),
  SMTP_PORT: z.coerce.number().int().positive().default(1025),
  SMTP_USER: z.string().optional().default(''),
  SMTP_PASSWORD: z.string().optional().default(''),
  GOOGLE_OAUTH_CLIENT_ID: z.string().optional().default(''),
  GOOGLE_OAUTH_CLIENT_SECRET: z.string().optional().default(''),
  FACEBOOK_OAUTH_CLIENT_ID: z.string().optional().default(''),
  FACEBOOK_OAUTH_CLIENT_SECRET: z.string().optional().default(''),
  MOMO_PARTNER_CODE: z.string().optional().default(''),
  MOMO_ACCESS_KEY: z.string().optional().default(''),
  MOMO_SECRET_KEY: z.string().optional().default(''),
  MOMO_ENDPOINT: z.string().optional().default(''),
  MOMO_IPN_URL: z.string().optional().default(''),
  MOMO_REDIRECT_URL: z.string().optional().default(''),
  SUPER_ADMIN_EMAIL: z.string().email(),
  SUPER_ADMIN_PASSWORD: z.string().min(12),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>) {
  const parsed = envSchema.safeParse(config);

  if (!parsed.success) {
    throw new Error(`Invalid environment variables: ${parsed.error.message}`);
  }

  return parsed.data;
}
