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
        `IF NOT EXISTS (SELECT 1 FROM [roles] WHERE [code] = @0)
         INSERT INTO [roles] ([code], [name], [description]) VALUES (@0, @1, @2);`,
        [code, code.replaceAll('_', ' '), description],
      );
    }

    for (const code of DEFAULT_PERMISSION_CODES) {
      await queryRunner.query(
        `IF NOT EXISTS (SELECT 1 FROM [permissions] WHERE [code] = @0)
         INSERT INTO [permissions] ([code], [name]) VALUES (@0, @1);`,
        [code, code],
      );
    }

    for (const [roleCode, permissions] of Object.entries(rolePermissions)) {
      for (const permissionCode of permissions) {
        await queryRunner.query(
          `INSERT INTO [role_permissions] ([roleId], [permissionId])
           SELECT r.[id], p.[id]
           FROM [roles] r
           CROSS JOIN [permissions] p
           WHERE r.[code] = @0 AND p.[code] = @1
             AND NOT EXISTS (
               SELECT 1 FROM [role_permissions] rp
               WHERE rp.[roleId] = r.[id] AND rp.[permissionId] = p.[id]
             );`,
          [roleCode, permissionCode],
        );
      }
    }

    const adminEmail = process.env.SUPER_ADMIN_EMAIL;
    const adminPassword = process.env.SUPER_ADMIN_PASSWORD;

    if (adminEmail && adminPassword) {
      const passwordHash = await argon2.hash(adminPassword, { type: argon2.argon2id });

      await queryRunner.query(
        `IF NOT EXISTS (SELECT 1 FROM [users] WHERE [email] = @0)
         INSERT INTO [users] ([email], [passwordHash], [displayName], [status], [emailVerifiedAt])
         VALUES (@0, @1, 'Super Admin', 'active', SYSUTCDATETIME());`,
        [adminEmail, passwordHash],
      );

      await queryRunner.query(
        `INSERT INTO [user_roles] ([userId], [roleId])
         SELECT u.[id], r.[id]
         FROM [users] u
         CROSS JOIN [roles] r
         WHERE u.[email] = @0 AND r.[code] = @1
           AND NOT EXISTS (
             SELECT 1 FROM [user_roles] ur
             WHERE ur.[userId] = u.[id] AND ur.[roleId] = r.[id]
           );`,
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
