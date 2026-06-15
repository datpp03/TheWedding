import argon2 from 'argon2';
import { DEFAULT_PERMISSION_CODES, PERMISSIONS, ROLES } from '@the-wedding/shared';
import dataSource from '../data-source';

const roleDescriptions = {
  [ROLES.SUPER_ADMIN]: 'Full platform access',
  [ROLES.ADMIN]: 'Administrative platform access',
  [ROLES.SUPPORT]: 'Support access with limited management rights',
  [ROLES.USER]: 'Tenant owner and member access',
  [ROLES.GUEST]: 'Public or invited guest access',
};

const rolePermissions = {
  [ROLES.SUPER_ADMIN]: DEFAULT_PERMISSION_CODES,
  [ROLES.ADMIN]: DEFAULT_PERMISSION_CODES.filter(
    (permission) => permission !== PERMISSIONS.USER_DELETE,
  ),
  [ROLES.SUPPORT]: [
    PERMISSIONS.USER_READ,
    PERMISSIONS.TENANT_READ,
    PERMISSIONS.MEDIA_READ,
    PERMISSIONS.AUDIT_READ,
  ],
  [ROLES.USER]: [
    PERMISSIONS.TENANT_CREATE,
    PERMISSIONS.TENANT_READ,
    PERMISSIONS.TENANT_UPDATE,
    PERMISSIONS.ALBUM_MANAGE,
    PERMISSIONS.MEDIA_READ,
    PERMISSIONS.MEDIA_UPLOAD,
    PERMISSIONS.MEDIA_UPDATE,
    PERMISSIONS.MEDIA_DELETE,
    PERMISSIONS.MEDIA_DOWNLOAD,
    PERMISSIONS.THEME_MANAGE,
  ],
  [ROLES.GUEST]: [PERMISSIONS.MEDIA_READ],
};

async function seed() {
  await dataSource.initialize();
  const queryRunner = dataSource.createQueryRunner();

  await queryRunner.startTransaction();

  try {
    for (const [code, description] of Object.entries(roleDescriptions)) {
      await queryRunner.query(
        `INSERT INTO "roles" ("code", "name", "description")
         VALUES ($1, $2, $3)
         ON CONFLICT ("code") DO NOTHING;`,
        [code, code.replaceAll('_', ' '), description],
      );
    }

    for (const code of DEFAULT_PERMISSION_CODES) {
      await queryRunner.query(
        `INSERT INTO "permissions" ("code", "name")
         VALUES ($1, $2)
         ON CONFLICT ("code") DO NOTHING;`,
        [code, code],
      );
    }

    for (const [roleCode, permissions] of Object.entries(rolePermissions)) {
      for (const permissionCode of permissions) {
        await queryRunner.query(
          `INSERT INTO "role_permissions" ("roleId", "permissionId")
           SELECT r."id", p."id"
           FROM "roles" r
           CROSS JOIN "permissions" p
           WHERE r."code" = $1 AND p."code" = $2
           ON CONFLICT ("roleId", "permissionId") DO NOTHING;`,
          [roleCode, permissionCode],
        );
      }
    }

    const adminEmail = process.env.SUPER_ADMIN_EMAIL;
    const adminPassword = process.env.SUPER_ADMIN_PASSWORD;

    const shouldCreateSuperAdmin =
      adminEmail && adminPassword && adminPassword !== 'ChangeMe!123456';

    if (shouldCreateSuperAdmin) {
      const passwordHash = await argon2.hash(adminPassword, { type: argon2.argon2id });

      await queryRunner.query(
        `INSERT INTO "users" ("email", "passwordHash", "displayName", "status", "emailVerifiedAt")
         SELECT $1::varchar, $2::varchar, 'Super Admin', 'active', now()
         WHERE NOT EXISTS (
           SELECT 1 FROM "users" WHERE "email" = $1 AND "deletedAt" IS NULL
         );`,
        [adminEmail, passwordHash],
      );

      await queryRunner.query(
        `INSERT INTO "user_roles" ("userId", "roleId")
         SELECT u."id", r."id"
         FROM "users" u
         CROSS JOIN "roles" r
         WHERE u."email" = $1 AND r."code" = $2 AND u."deletedAt" IS NULL
         ON CONFLICT ("userId", "roleId") DO NOTHING;`,
        [adminEmail, ROLES.SUPER_ADMIN],
      );
    }

    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
    await dataSource.destroy();
  }
}

void seed();
