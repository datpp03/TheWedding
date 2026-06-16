import { MigrationInterface, QueryRunner } from 'typeorm';

export class MediaProcessingPipeline1710000007000 implements MigrationInterface {
  name = 'MediaProcessingPipeline1710000007000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "processingFailureReason" text NULL;`,
    );
    await queryRunner.query(
      `ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "processingAttempts" integer NOT NULL DEFAULT 0;`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "IX_media_versions_media_type";`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "UQ_media_versions_media_type" ON "media_versions" ("mediaId", "versionType");`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IX_media_failure_status" ON "media" ("processingStatus", "processingAttempts", "createdAt");`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IX_media_failure_status";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_media_versions_media_type";`);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IX_media_versions_media_type" ON "media_versions" ("mediaId", "versionType");`,
    );
    await queryRunner.query(`ALTER TABLE "media" DROP COLUMN IF EXISTS "processingAttempts";`);
    await queryRunner.query(`ALTER TABLE "media" DROP COLUMN IF EXISTS "processingFailureReason";`);
  }
}
