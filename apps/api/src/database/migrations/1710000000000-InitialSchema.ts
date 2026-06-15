import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1710000000000 implements MigrationInterface {
  name = 'InitialSchema1710000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "email" varchar(320) NOT NULL,
        "passwordHash" varchar(500) NOT NULL,
        "displayName" varchar(200) NOT NULL,
        "avatarUrl" varchar(1000) NULL,
        "status" varchar(40) NOT NULL DEFAULT 'pending_verification',
        "emailVerifiedAt" timestamptz NULL,
        "lockedUntil" timestamptz NULL,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        "deletedAt" timestamptz NULL,
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      );
    `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_users_email_active" ON "users" ("email") WHERE "deletedAt" IS NULL;`,
    );

    await queryRunner.query(`
      CREATE TABLE "user_sessions" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "userId" uuid NOT NULL,
        "refreshTokenHash" varchar(500) NOT NULL,
        "refreshTokenFamilyId" uuid NOT NULL,
        "deviceName" varchar(200) NULL,
        "ipAddress" varchar(80) NULL,
        "userAgent" varchar(1000) NULL,
        "expiresAt" timestamptz NOT NULL,
        "revokedAt" timestamptz NULL,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_user_sessions" PRIMARY KEY ("id"),
        CONSTRAINT "FK_user_sessions_user" FOREIGN KEY ("userId") REFERENCES "users"("id")
      );
    `);
    await queryRunner.query(
      `CREATE INDEX "IX_user_sessions_userId_expiresAt" ON "user_sessions" ("userId", "expiresAt");`,
    );
    await queryRunner.query(
      `CREATE INDEX "IX_user_sessions_family" ON "user_sessions" ("refreshTokenFamilyId");`,
    );

    await queryRunner.query(`
      CREATE TABLE "user_login_histories" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "userId" uuid NULL,
        "email" varchar(320) NOT NULL,
        "success" boolean NOT NULL,
        "failureReason" varchar(200) NULL,
        "ipAddress" varchar(80) NULL,
        "userAgent" varchar(1000) NULL,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_user_login_histories" PRIMARY KEY ("id"),
        CONSTRAINT "FK_user_login_histories_user" FOREIGN KEY ("userId") REFERENCES "users"("id")
      );
    `);
    await queryRunner.query(
      `CREATE INDEX "IX_user_login_histories_email_createdAt" ON "user_login_histories" ("email", "createdAt");`,
    );

    await queryRunner.query(`
      CREATE TABLE "password_reset_tokens" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "userId" uuid NOT NULL,
        "tokenHash" varchar(500) NOT NULL,
        "expiresAt" timestamptz NOT NULL,
        "usedAt" timestamptz NULL,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_password_reset_tokens" PRIMARY KEY ("id"),
        CONSTRAINT "FK_password_reset_tokens_user" FOREIGN KEY ("userId") REFERENCES "users"("id")
      );
    `);
    await queryRunner.query(
      `CREATE INDEX "IX_password_reset_tokens_userId_expiresAt" ON "password_reset_tokens" ("userId", "expiresAt");`,
    );

    await queryRunner.query(`
      CREATE TABLE "email_verification_tokens" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "userId" uuid NOT NULL,
        "tokenHash" varchar(500) NOT NULL,
        "expiresAt" timestamptz NOT NULL,
        "usedAt" timestamptz NULL,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_email_verification_tokens" PRIMARY KEY ("id"),
        CONSTRAINT "FK_email_verification_tokens_user" FOREIGN KEY ("userId") REFERENCES "users"("id")
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "roles" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "code" varchar(80) NOT NULL,
        "name" varchar(120) NOT NULL,
        "description" varchar(500) NULL,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_roles" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_roles_code" UNIQUE ("code")
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "permissions" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "code" varchar(120) NOT NULL,
        "name" varchar(160) NOT NULL,
        "description" varchar(500) NULL,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_permissions" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_permissions_code" UNIQUE ("code")
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "user_roles" (
        "userId" uuid NOT NULL,
        "roleId" uuid NOT NULL,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_user_roles" PRIMARY KEY ("userId", "roleId"),
        CONSTRAINT "FK_user_roles_user" FOREIGN KEY ("userId") REFERENCES "users"("id"),
        CONSTRAINT "FK_user_roles_role" FOREIGN KEY ("roleId") REFERENCES "roles"("id")
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "role_permissions" (
        "roleId" uuid NOT NULL,
        "permissionId" uuid NOT NULL,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_role_permissions" PRIMARY KEY ("roleId", "permissionId"),
        CONSTRAINT "FK_role_permissions_role" FOREIGN KEY ("roleId") REFERENCES "roles"("id"),
        CONSTRAINT "FK_role_permissions_permission" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id")
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "tenants" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "ownerUserId" uuid NOT NULL,
        "slug" varchar(120) NOT NULL,
        "siteName" varchar(200) NOT NULL,
        "brideName" varchar(160) NULL,
        "groomName" varchar(160) NULL,
        "weddingDate" date NULL,
        "description" text NULL,
        "visibility" varchar(40) NOT NULL DEFAULT 'private',
        "passwordHash" varchar(500) NULL,
        "customDomain" varchar(255) NULL,
        "status" varchar(40) NOT NULL DEFAULT 'active',
        "settingsJson" text NULL,
        "seoJson" text NULL,
        "sharingJson" text NULL,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        "deletedAt" timestamptz NULL,
        CONSTRAINT "PK_tenants" PRIMARY KEY ("id"),
        CONSTRAINT "FK_tenants_owner" FOREIGN KEY ("ownerUserId") REFERENCES "users"("id")
      );
    `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_tenants_slug_active" ON "tenants" ("slug") WHERE "deletedAt" IS NULL;`,
    );
    await queryRunner.query(`CREATE INDEX "IX_tenants_ownerUserId" ON "tenants" ("ownerUserId");`);

    await queryRunner.query(`
      CREATE TABLE "tenant_members" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "tenantId" uuid NOT NULL,
        "userId" uuid NOT NULL,
        "role" varchar(60) NOT NULL DEFAULT 'owner',
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_tenant_members" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_tenant_members_tenant_user" UNIQUE ("tenantId", "userId"),
        CONSTRAINT "FK_tenant_members_tenant" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id"),
        CONSTRAINT "FK_tenant_members_user" FOREIGN KEY ("userId") REFERENCES "users"("id")
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "albums" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "tenantId" uuid NOT NULL,
        "title" varchar(200) NOT NULL,
        "description" text NULL,
        "coverMediaId" uuid NULL,
        "visibility" varchar(40) NOT NULL DEFAULT 'private',
        "passwordHash" varchar(500) NULL,
        "sortOrder" integer NOT NULL DEFAULT 0,
        "layoutType" varchar(60) NOT NULL DEFAULT 'grid',
        "themeOverrideJson" text NULL,
        "allowDownload" boolean NOT NULL DEFAULT false,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        "deletedAt" timestamptz NULL,
        CONSTRAINT "PK_albums" PRIMARY KEY ("id"),
        CONSTRAINT "FK_albums_tenant" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id")
      );
    `);
    await queryRunner.query(
      `CREATE INDEX "IX_albums_tenant_sort" ON "albums" ("tenantId", "sortOrder");`,
    );

    await queryRunner.query(`
      CREATE TABLE "media" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "tenantId" uuid NOT NULL,
        "albumId" uuid NOT NULL,
        "type" varchar(40) NOT NULL,
        "originalFileName" varchar(500) NOT NULL,
        "storedFileName" varchar(500) NOT NULL,
        "mimeType" varchar(160) NOT NULL,
        "sizeBytes" bigint NOT NULL,
        "width" integer NULL,
        "height" integer NULL,
        "durationSeconds" integer NULL,
        "storageProvider" varchar(60) NOT NULL,
        "storageKey" varchar(1000) NOT NULL,
        "publicUrl" varchar(1000) NULL,
        "thumbnailUrl" varchar(1000) NULL,
        "optimizedUrl" varchar(1000) NULL,
        "blurHash" varchar(200) NULL,
        "title" varchar(200) NULL,
        "description" text NULL,
        "takenAt" timestamptz NULL,
        "sortOrder" integer NOT NULL DEFAULT 0,
        "metadataJson" text NULL,
        "processingStatus" varchar(40) NOT NULL DEFAULT 'pending',
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        "deletedAt" timestamptz NULL,
        CONSTRAINT "PK_media" PRIMARY KEY ("id"),
        CONSTRAINT "FK_media_tenant" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id"),
        CONSTRAINT "FK_media_album" FOREIGN KEY ("albumId") REFERENCES "albums"("id")
      );
    `);
    await queryRunner.query(
      `CREATE INDEX "IX_media_tenant_album_sort" ON "media" ("tenantId", "albumId", "sortOrder");`,
    );
    await queryRunner.query(
      `CREATE INDEX "IX_media_processingStatus" ON "media" ("processingStatus", "createdAt");`,
    );
    await queryRunner.query(
      `ALTER TABLE "albums" ADD CONSTRAINT "FK_albums_coverMedia" FOREIGN KEY ("coverMediaId") REFERENCES "media"("id");`,
    );

    await queryRunner.query(`
      CREATE TABLE "media_versions" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "mediaId" uuid NOT NULL,
        "versionType" varchar(40) NOT NULL,
        "storageKey" varchar(1000) NOT NULL,
        "url" varchar(1000) NULL,
        "metadataJson" text NULL,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_media_versions" PRIMARY KEY ("id"),
        CONSTRAINT "FK_media_versions_media" FOREIGN KEY ("mediaId") REFERENCES "media"("id")
      );
    `);
    await queryRunner.query(
      `CREATE INDEX "IX_media_versions_media_type" ON "media_versions" ("mediaId", "versionType");`,
    );

    await queryRunner.query(`
      CREATE TABLE "themes" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "tenantId" uuid NOT NULL,
        "name" varchar(160) NOT NULL,
        "primaryColor" varchar(40) NOT NULL,
        "secondaryColor" varchar(40) NOT NULL,
        "backgroundColor" varchar(40) NOT NULL,
        "textColor" varchar(40) NOT NULL,
        "fontFamily" varchar(160) NOT NULL,
        "layoutType" varchar(60) NOT NULL,
        "animationType" varchar(60) NULL,
        "customCss" text NULL,
        "configJson" text NULL,
        "isActive" boolean NOT NULL DEFAULT false,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_themes" PRIMARY KEY ("id"),
        CONSTRAINT "FK_themes_tenant" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id")
      );
    `);
    await queryRunner.query(
      `CREATE INDEX "IX_themes_tenant_active" ON "themes" ("tenantId", "isActive");`,
    );

    await queryRunner.query(`
      CREATE TABLE "audit_logs" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "actorUserId" uuid NULL,
        "tenantId" uuid NULL,
        "action" varchar(160) NOT NULL,
        "entityType" varchar(120) NOT NULL,
        "entityId" uuid NULL,
        "metadataJson" text NULL,
        "ipAddress" varchar(80) NULL,
        "userAgent" varchar(1000) NULL,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_audit_logs" PRIMARY KEY ("id"),
        CONSTRAINT "FK_audit_logs_actor" FOREIGN KEY ("actorUserId") REFERENCES "users"("id"),
        CONSTRAINT "FK_audit_logs_tenant" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id")
      );
    `);
    await queryRunner.query(
      `CREATE INDEX "IX_audit_logs_tenant_createdAt" ON "audit_logs" ("tenantId", "createdAt");`,
    );
    await queryRunner.query(
      `CREATE INDEX "IX_audit_logs_action_createdAt" ON "audit_logs" ("action", "createdAt");`,
    );

    await queryRunner.query(`
      CREATE TABLE "system_settings" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "key" varchar(160) NOT NULL,
        "valueJson" text NOT NULL,
        "description" varchar(500) NULL,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_system_settings" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_system_settings_key" UNIQUE ("key")
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "storage_usage" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "tenantId" uuid NOT NULL,
        "usedBytes" bigint NOT NULL DEFAULT 0,
        "fileCount" integer NOT NULL DEFAULT 0,
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_storage_usage" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_storage_usage_tenant" UNIQUE ("tenantId"),
        CONSTRAINT "FK_storage_usage_tenant" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id")
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "feature_flags" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "key" varchar(160) NOT NULL,
        "description" varchar(500) NULL,
        "enabled" boolean NOT NULL DEFAULT false,
        "rulesJson" text NULL,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_feature_flags" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_feature_flags_key" UNIQUE ("key")
      );
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "feature_flags";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "storage_usage";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "system_settings";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "audit_logs";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "themes";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "media_versions";`);
    await queryRunner.query(
      `ALTER TABLE "albums" DROP CONSTRAINT IF EXISTS "FK_albums_coverMedia";`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "media";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "albums";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tenant_members";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tenants";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "role_permissions";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_roles";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "permissions";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "roles";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "email_verification_tokens";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "password_reset_tokens";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_login_histories";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_sessions";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users";`);
  }
}
