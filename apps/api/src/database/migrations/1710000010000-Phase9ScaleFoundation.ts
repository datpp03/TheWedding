import { MigrationInterface, QueryRunner } from 'typeorm';

export class Phase9ScaleFoundation1710000010000 implements MigrationInterface {
  name = 'Phase9ScaleFoundation1710000010000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user_public_handles" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "userId" uuid NOT NULL,
        "handle" varchar(24) NOT NULL,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_user_public_handles" PRIMARY KEY ("id"),
        CONSTRAINT "FK_user_public_handles_user" FOREIGN KEY ("userId") REFERENCES "users"("id")
      );
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_user_public_handles_user"
      ON "user_public_handles" ("userId");
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_user_public_handles_handle"
      ON "user_public_handles" ("handle");
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "plan_subscriptions" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "tenantId" uuid NULL,
        "userId" uuid NULL,
        "planId" varchar(80) NOT NULL,
        "segment" varchar(40) NOT NULL,
        "status" varchar(40) NOT NULL,
        "provider" varchar(40) NULL,
        "providerSubscriptionId" varchar(160) NULL,
        "currentPeriodEndsAt" timestamptz NULL,
        "metadataJson" text NULL,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_plan_subscriptions" PRIMARY KEY ("id"),
        CONSTRAINT "FK_plan_subscriptions_tenant" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id"),
        CONSTRAINT "FK_plan_subscriptions_user" FOREIGN KEY ("userId") REFERENCES "users"("id")
      );
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IX_plan_subscriptions_scope_status"
      ON "plan_subscriptions" ("tenantId", "userId", "status", "createdAt");
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "entitlements" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "subjectType" varchar(20) NOT NULL,
        "subjectId" uuid NOT NULL,
        "featureKey" varchar(80) NULL,
        "storageBoostBytes" bigint NOT NULL DEFAULT 0,
        "granted" boolean NOT NULL DEFAULT true,
        "reason" text NULL,
        "grantedByUserId" uuid NULL,
        "startsAt" timestamptz NULL,
        "expiresAt" timestamptz NULL,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_entitlements" PRIMARY KEY ("id"),
        CONSTRAINT "FK_entitlements_granted_by" FOREIGN KEY ("grantedByUserId") REFERENCES "users"("id")
      );
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IX_entitlements_subject"
      ON "entitlements" ("subjectType", "subjectId", "featureKey", "granted");
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "payment_events" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "provider" varchar(40) NOT NULL,
        "providerEventId" varchar(160) NOT NULL,
        "eventType" varchar(80) NOT NULL,
        "status" varchar(40) NOT NULL,
        "amount" bigint NULL,
        "currency" varchar(10) NULL,
        "metadataJson" text NULL,
        "processedAt" timestamptz NULL,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_payment_events" PRIMARY KEY ("id")
      );
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_payment_events_provider_event"
      ON "payment_events" ("provider", "providerEventId");
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "custom_domains" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "tenantId" uuid NOT NULL,
        "domain" varchar(255) NOT NULL,
        "verificationStatus" varchar(40) NOT NULL,
        "verificationToken" varchar(160) NOT NULL,
        "lastCheckedAt" timestamptz NULL,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_custom_domains" PRIMARY KEY ("id"),
        CONSTRAINT "FK_custom_domains_tenant" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id")
      );
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_custom_domains_domain"
      ON "custom_domains" ("domain");
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "studio_profiles" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "ownerUserId" uuid NOT NULL,
        "displayName" varchar(200) NOT NULL,
        "status" varchar(40) NOT NULL,
        "planId" varchar(80) NULL,
        "brandingJson" text NULL,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_studio_profiles" PRIMARY KEY ("id"),
        CONSTRAINT "FK_studio_profiles_owner" FOREIGN KEY ("ownerUserId") REFERENCES "users"("id")
      );
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_studio_profiles_owner"
      ON "studio_profiles" ("ownerUserId");
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "studio_clients" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "studioProfileId" uuid NOT NULL,
        "tenantId" uuid NULL,
        "displayName" varchar(200) NOT NULL,
        "email" varchar(320) NULL,
        "status" varchar(40) NOT NULL,
        "notes" text NULL,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_studio_clients" PRIMARY KEY ("id"),
        CONSTRAINT "FK_studio_clients_studio" FOREIGN KEY ("studioProfileId") REFERENCES "studio_profiles"("id"),
        CONSTRAINT "FK_studio_clients_tenant" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id")
      );
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IX_studio_clients_profile_status"
      ON "studio_clients" ("studioProfileId", "status", "createdAt");
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "analytics_events" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "tenantId" uuid NOT NULL,
        "albumId" uuid NULL,
        "mediaId" uuid NULL,
        "eventType" varchar(60) NOT NULL,
        "actorUserId" uuid NULL,
        "metadataJson" text NULL,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_analytics_events" PRIMARY KEY ("id"),
        CONSTRAINT "FK_analytics_events_tenant" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id"),
        CONSTRAINT "FK_analytics_events_album" FOREIGN KEY ("albumId") REFERENCES "albums"("id"),
        CONSTRAINT "FK_analytics_events_media" FOREIGN KEY ("mediaId") REFERENCES "media"("id"),
        CONSTRAINT "FK_analytics_events_actor" FOREIGN KEY ("actorUserId") REFERENCES "users"("id")
      );
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IX_analytics_events_scope"
      ON "analytics_events" ("tenantId", "albumId", "eventType", "createdAt");
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "greeting_rules" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "scopeType" varchar(20) NOT NULL,
        "scopeId" uuid NULL,
        "triggerType" varchar(60) NOT NULL,
        "locale" varchar(10) NOT NULL,
        "templateKey" varchar(160) NOT NULL,
        "dateMonth" integer NULL,
        "dateDay" integer NULL,
        "customDate" date NULL,
        "enabled" boolean NOT NULL DEFAULT false,
        "createdByUserId" uuid NULL,
        "metadataJson" text NULL,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_greeting_rules" PRIMARY KEY ("id"),
        CONSTRAINT "FK_greeting_rules_creator" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id")
      );
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IX_greeting_rules_scope_trigger"
      ON "greeting_rules" ("scopeType", "scopeId", "triggerType", "enabled");
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "greeting_rules";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "analytics_events";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "studio_clients";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "studio_profiles";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "custom_domains";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "payment_events";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "entitlements";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "plan_subscriptions";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_public_handles";`);
  }
}
