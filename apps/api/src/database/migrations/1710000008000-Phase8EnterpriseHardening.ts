import { MigrationInterface, QueryRunner } from 'typeorm';

export class Phase8EnterpriseHardening1710000008000 implements MigrationInterface {
  name = 'Phase8EnterpriseHardening1710000008000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "mfaEnabledAt" timestamptz NULL;`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "mfaMethod" varchar(40) NULL;`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "mfaSecretEncrypted" text NULL;`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "mfaSecretEncrypted";`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "mfaMethod";`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "mfaEnabledAt";`);
  }
}
