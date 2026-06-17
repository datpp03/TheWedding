import { MigrationInterface, QueryRunner } from 'typeorm';

export class PublicAlbumSocialExpansion1710000009000 implements MigrationInterface {
  name = 'PublicAlbumSocialExpansion1710000009000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "oauth_accounts" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "userId" uuid NOT NULL,
        "provider" varchar(40) NOT NULL,
        "providerSubject" varchar(200) NOT NULL,
        "verifiedEmail" varchar(320) NULL,
        "status" varchar(40) NOT NULL DEFAULT 'active',
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_oauth_accounts" PRIMARY KEY ("id"),
        CONSTRAINT "FK_oauth_accounts_user" FOREIGN KEY ("userId") REFERENCES "users"("id")
      );
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_oauth_accounts_provider_subject"
      ON "oauth_accounts" ("provider", "providerSubject");
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "album_featured_entries" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "tenantId" uuid NOT NULL,
        "albumId" uuid NOT NULL,
        "window" varchar(20) NOT NULL,
        "source" varchar(40) NOT NULL DEFAULT 'algorithm',
        "score" integer NOT NULL DEFAULT 0,
        "metadataJson" text NULL,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_album_featured_entries" PRIMARY KEY ("id"),
        CONSTRAINT "FK_album_featured_entries_tenant" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id"),
        CONSTRAINT "FK_album_featured_entries_album" FOREIGN KEY ("albumId") REFERENCES "albums"("id")
      );
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IX_album_featured_entries_window_score"
      ON "album_featured_entries" ("window", "score", "createdAt");
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "album_wishes" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "tenantId" uuid NOT NULL,
        "albumId" uuid NOT NULL,
        "userId" uuid NOT NULL,
        "displayNameSnapshot" varchar(200) NOT NULL,
        "message" text NOT NULL,
        "status" varchar(40) NOT NULL DEFAULT 'visible',
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        "deletedAt" timestamptz NULL,
        CONSTRAINT "PK_album_wishes" PRIMARY KEY ("id"),
        CONSTRAINT "FK_album_wishes_tenant" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id"),
        CONSTRAINT "FK_album_wishes_album" FOREIGN KEY ("albumId") REFERENCES "albums"("id"),
        CONSTRAINT "FK_album_wishes_user" FOREIGN KEY ("userId") REFERENCES "users"("id")
      );
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_album_wishes_user_album_active"
      ON "album_wishes" ("albumId", "userId") WHERE "deletedAt" IS NULL;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "album_reactions" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "tenantId" uuid NOT NULL,
        "albumId" uuid NOT NULL,
        "userId" uuid NOT NULL,
        "symbolKey" varchar(60) NOT NULL,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "deletedAt" timestamptz NULL,
        CONSTRAINT "PK_album_reactions" PRIMARY KEY ("id"),
        CONSTRAINT "FK_album_reactions_tenant" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id"),
        CONSTRAINT "FK_album_reactions_album" FOREIGN KEY ("albumId") REFERENCES "albums"("id"),
        CONSTRAINT "FK_album_reactions_user" FOREIGN KEY ("userId") REFERENCES "users"("id")
      );
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_album_reactions_user_symbol_active"
      ON "album_reactions" ("albumId", "userId", "symbolKey") WHERE "deletedAt" IS NULL;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "album_reaction_symbols" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "tenantId" uuid NOT NULL,
        "albumId" uuid NOT NULL,
        "symbolKey" varchar(60) NOT NULL,
        "glyph" varchar(20) NOT NULL,
        "sortOrder" integer NOT NULL DEFAULT 0,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_album_reaction_symbols" PRIMARY KEY ("id"),
        CONSTRAINT "FK_album_reaction_symbols_tenant" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id"),
        CONSTRAINT "FK_album_reaction_symbols_album" FOREIGN KEY ("albumId") REFERENCES "albums"("id")
      );
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_album_reaction_symbols_album_key"
      ON "album_reaction_symbols" ("albumId", "symbolKey");
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "album_search_metadata" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "tenantId" uuid NOT NULL,
        "albumId" uuid NOT NULL,
        "ageMin" integer NULL,
        "ageMax" integer NULL,
        "region" varchar(120) NULL,
        "venue" varchar(200) NULL,
        "theme" varchar(120) NULL,
        "eventDate" timestamptz NULL,
        "ownerOptIn" boolean NOT NULL DEFAULT false,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_album_search_metadata" PRIMARY KEY ("id"),
        CONSTRAINT "FK_album_search_metadata_tenant" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id"),
        CONSTRAINT "FK_album_search_metadata_album" FOREIGN KEY ("albumId") REFERENCES "albums"("id")
      );
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_album_search_metadata_album"
      ON "album_search_metadata" ("albumId");
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "album_search_metadata";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "album_reaction_symbols";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "album_reactions";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "album_wishes";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "album_featured_entries";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "oauth_accounts";`);
  }
}
