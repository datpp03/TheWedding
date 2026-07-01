import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlbumPublicSlugs1710000011000 implements MigrationInterface {
  name = 'AlbumPublicSlugs1710000011000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "albums"
      ADD COLUMN IF NOT EXISTS "slug" varchar(220);
    `);
    await queryRunner.query(`
      UPDATE "albums"
      SET "slug" = CONCAT(
        COALESCE(
          NULLIF(
            TRIM(BOTH '-' FROM LOWER(REGEXP_REPLACE("title", '[^a-zA-Z0-9]+', '-', 'g'))),
            ''
          ),
          'album'
        ),
        '-',
        SUBSTRING("id"::text, 1, 8)
      )
      WHERE "slug" IS NULL OR "slug" = '';
    `);
    await queryRunner.query(`
      ALTER TABLE "albums"
      ALTER COLUMN "slug" SET NOT NULL;
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_albums_slug_active"
      ON "albums" ("slug")
      WHERE "deletedAt" IS NULL;
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_albums_slug_active";`);
    await queryRunner.query(`ALTER TABLE "albums" DROP COLUMN IF EXISTS "slug";`);
  }
}
