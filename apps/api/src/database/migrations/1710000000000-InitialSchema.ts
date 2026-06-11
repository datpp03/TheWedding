import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1710000000000 implements MigrationInterface {
  name = 'InitialSchema1710000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE [users] (
        [id] uniqueidentifier NOT NULL CONSTRAINT [DF_users_id] DEFAULT NEWID(),
        [email] nvarchar(320) NOT NULL,
        [passwordHash] nvarchar(500) NOT NULL,
        [displayName] nvarchar(200) NOT NULL,
        [avatarUrl] nvarchar(1000) NULL,
        [status] nvarchar(40) NOT NULL CONSTRAINT [DF_users_status] DEFAULT 'pending_verification',
        [emailVerifiedAt] datetime2 NULL,
        [lockedUntil] datetime2 NULL,
        [createdAt] datetime2 NOT NULL CONSTRAINT [DF_users_createdAt] DEFAULT SYSUTCDATETIME(),
        [updatedAt] datetime2 NOT NULL CONSTRAINT [DF_users_updatedAt] DEFAULT SYSUTCDATETIME(),
        [deletedAt] datetime2 NULL,
        CONSTRAINT [PK_users] PRIMARY KEY ([id])
      );
    `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX [UQ_users_email_active] ON [users] ([email]) WHERE [deletedAt] IS NULL;`,
    );

    await queryRunner.query(`
      CREATE TABLE [user_sessions] (
        [id] uniqueidentifier NOT NULL CONSTRAINT [DF_user_sessions_id] DEFAULT NEWID(),
        [userId] uniqueidentifier NOT NULL,
        [refreshTokenHash] nvarchar(500) NOT NULL,
        [refreshTokenFamilyId] uniqueidentifier NOT NULL,
        [deviceName] nvarchar(200) NULL,
        [ipAddress] nvarchar(80) NULL,
        [userAgent] nvarchar(1000) NULL,
        [expiresAt] datetime2 NOT NULL,
        [revokedAt] datetime2 NULL,
        [createdAt] datetime2 NOT NULL CONSTRAINT [DF_user_sessions_createdAt] DEFAULT SYSUTCDATETIME(),
        [updatedAt] datetime2 NOT NULL CONSTRAINT [DF_user_sessions_updatedAt] DEFAULT SYSUTCDATETIME(),
        CONSTRAINT [PK_user_sessions] PRIMARY KEY ([id]),
        CONSTRAINT [FK_user_sessions_user] FOREIGN KEY ([userId]) REFERENCES [users]([id])
      );
    `);
    await queryRunner.query(
      `CREATE INDEX [IX_user_sessions_userId_expiresAt] ON [user_sessions] ([userId], [expiresAt]);`,
    );
    await queryRunner.query(
      `CREATE INDEX [IX_user_sessions_family] ON [user_sessions] ([refreshTokenFamilyId]);`,
    );

    await queryRunner.query(`
      CREATE TABLE [user_login_histories] (
        [id] uniqueidentifier NOT NULL CONSTRAINT [DF_user_login_histories_id] DEFAULT NEWID(),
        [userId] uniqueidentifier NULL,
        [email] nvarchar(320) NOT NULL,
        [success] bit NOT NULL,
        [failureReason] nvarchar(200) NULL,
        [ipAddress] nvarchar(80) NULL,
        [userAgent] nvarchar(1000) NULL,
        [createdAt] datetime2 NOT NULL CONSTRAINT [DF_user_login_histories_createdAt] DEFAULT SYSUTCDATETIME(),
        CONSTRAINT [PK_user_login_histories] PRIMARY KEY ([id]),
        CONSTRAINT [FK_user_login_histories_user] FOREIGN KEY ([userId]) REFERENCES [users]([id])
      );
    `);
    await queryRunner.query(
      `CREATE INDEX [IX_user_login_histories_email_createdAt] ON [user_login_histories] ([email], [createdAt]);`,
    );

    await queryRunner.query(`
      CREATE TABLE [password_reset_tokens] (
        [id] uniqueidentifier NOT NULL CONSTRAINT [DF_password_reset_tokens_id] DEFAULT NEWID(),
        [userId] uniqueidentifier NOT NULL,
        [tokenHash] nvarchar(500) NOT NULL,
        [expiresAt] datetime2 NOT NULL,
        [usedAt] datetime2 NULL,
        [createdAt] datetime2 NOT NULL CONSTRAINT [DF_password_reset_tokens_createdAt] DEFAULT SYSUTCDATETIME(),
        CONSTRAINT [PK_password_reset_tokens] PRIMARY KEY ([id]),
        CONSTRAINT [FK_password_reset_tokens_user] FOREIGN KEY ([userId]) REFERENCES [users]([id])
      );
    `);
    await queryRunner.query(
      `CREATE INDEX [IX_password_reset_tokens_userId_expiresAt] ON [password_reset_tokens] ([userId], [expiresAt]);`,
    );

    await queryRunner.query(`
      CREATE TABLE [email_verification_tokens] (
        [id] uniqueidentifier NOT NULL CONSTRAINT [DF_email_verification_tokens_id] DEFAULT NEWID(),
        [userId] uniqueidentifier NOT NULL,
        [tokenHash] nvarchar(500) NOT NULL,
        [expiresAt] datetime2 NOT NULL,
        [usedAt] datetime2 NULL,
        [createdAt] datetime2 NOT NULL CONSTRAINT [DF_email_verification_tokens_createdAt] DEFAULT SYSUTCDATETIME(),
        CONSTRAINT [PK_email_verification_tokens] PRIMARY KEY ([id]),
        CONSTRAINT [FK_email_verification_tokens_user] FOREIGN KEY ([userId]) REFERENCES [users]([id])
      );
    `);

    await queryRunner.query(`
      CREATE TABLE [roles] (
        [id] uniqueidentifier NOT NULL CONSTRAINT [DF_roles_id] DEFAULT NEWID(),
        [code] nvarchar(80) NOT NULL,
        [name] nvarchar(120) NOT NULL,
        [description] nvarchar(500) NULL,
        [createdAt] datetime2 NOT NULL CONSTRAINT [DF_roles_createdAt] DEFAULT SYSUTCDATETIME(),
        [updatedAt] datetime2 NOT NULL CONSTRAINT [DF_roles_updatedAt] DEFAULT SYSUTCDATETIME(),
        CONSTRAINT [PK_roles] PRIMARY KEY ([id]),
        CONSTRAINT [UQ_roles_code] UNIQUE ([code])
      );
    `);

    await queryRunner.query(`
      CREATE TABLE [permissions] (
        [id] uniqueidentifier NOT NULL CONSTRAINT [DF_permissions_id] DEFAULT NEWID(),
        [code] nvarchar(120) NOT NULL,
        [name] nvarchar(160) NOT NULL,
        [description] nvarchar(500) NULL,
        [createdAt] datetime2 NOT NULL CONSTRAINT [DF_permissions_createdAt] DEFAULT SYSUTCDATETIME(),
        [updatedAt] datetime2 NOT NULL CONSTRAINT [DF_permissions_updatedAt] DEFAULT SYSUTCDATETIME(),
        CONSTRAINT [PK_permissions] PRIMARY KEY ([id]),
        CONSTRAINT [UQ_permissions_code] UNIQUE ([code])
      );
    `);

    await queryRunner.query(`
      CREATE TABLE [user_roles] (
        [userId] uniqueidentifier NOT NULL,
        [roleId] uniqueidentifier NOT NULL,
        [createdAt] datetime2 NOT NULL CONSTRAINT [DF_user_roles_createdAt] DEFAULT SYSUTCDATETIME(),
        CONSTRAINT [PK_user_roles] PRIMARY KEY ([userId], [roleId]),
        CONSTRAINT [FK_user_roles_user] FOREIGN KEY ([userId]) REFERENCES [users]([id]),
        CONSTRAINT [FK_user_roles_role] FOREIGN KEY ([roleId]) REFERENCES [roles]([id])
      );
    `);

    await queryRunner.query(`
      CREATE TABLE [role_permissions] (
        [roleId] uniqueidentifier NOT NULL,
        [permissionId] uniqueidentifier NOT NULL,
        [createdAt] datetime2 NOT NULL CONSTRAINT [DF_role_permissions_createdAt] DEFAULT SYSUTCDATETIME(),
        CONSTRAINT [PK_role_permissions] PRIMARY KEY ([roleId], [permissionId]),
        CONSTRAINT [FK_role_permissions_role] FOREIGN KEY ([roleId]) REFERENCES [roles]([id]),
        CONSTRAINT [FK_role_permissions_permission] FOREIGN KEY ([permissionId]) REFERENCES [permissions]([id])
      );
    `);

    await queryRunner.query(`
      CREATE TABLE [tenants] (
        [id] uniqueidentifier NOT NULL CONSTRAINT [DF_tenants_id] DEFAULT NEWID(),
        [ownerUserId] uniqueidentifier NOT NULL,
        [slug] nvarchar(120) NOT NULL,
        [siteName] nvarchar(200) NOT NULL,
        [brideName] nvarchar(160) NULL,
        [groomName] nvarchar(160) NULL,
        [weddingDate] date NULL,
        [description] nvarchar(max) NULL,
        [visibility] nvarchar(40) NOT NULL CONSTRAINT [DF_tenants_visibility] DEFAULT 'private',
        [passwordHash] nvarchar(500) NULL,
        [customDomain] nvarchar(255) NULL,
        [status] nvarchar(40) NOT NULL CONSTRAINT [DF_tenants_status] DEFAULT 'active',
        [settingsJson] nvarchar(max) NULL,
        [seoJson] nvarchar(max) NULL,
        [sharingJson] nvarchar(max) NULL,
        [createdAt] datetime2 NOT NULL CONSTRAINT [DF_tenants_createdAt] DEFAULT SYSUTCDATETIME(),
        [updatedAt] datetime2 NOT NULL CONSTRAINT [DF_tenants_updatedAt] DEFAULT SYSUTCDATETIME(),
        [deletedAt] datetime2 NULL,
        CONSTRAINT [PK_tenants] PRIMARY KEY ([id]),
        CONSTRAINT [FK_tenants_owner] FOREIGN KEY ([ownerUserId]) REFERENCES [users]([id])
      );
    `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX [UQ_tenants_slug_active] ON [tenants] ([slug]) WHERE [deletedAt] IS NULL;`,
    );
    await queryRunner.query(`CREATE INDEX [IX_tenants_ownerUserId] ON [tenants] ([ownerUserId]);`);

    await queryRunner.query(`
      CREATE TABLE [tenant_members] (
        [id] uniqueidentifier NOT NULL CONSTRAINT [DF_tenant_members_id] DEFAULT NEWID(),
        [tenantId] uniqueidentifier NOT NULL,
        [userId] uniqueidentifier NOT NULL,
        [role] nvarchar(60) NOT NULL CONSTRAINT [DF_tenant_members_role] DEFAULT 'owner',
        [createdAt] datetime2 NOT NULL CONSTRAINT [DF_tenant_members_createdAt] DEFAULT SYSUTCDATETIME(),
        [updatedAt] datetime2 NOT NULL CONSTRAINT [DF_tenant_members_updatedAt] DEFAULT SYSUTCDATETIME(),
        CONSTRAINT [PK_tenant_members] PRIMARY KEY ([id]),
        CONSTRAINT [UQ_tenant_members_tenant_user] UNIQUE ([tenantId], [userId]),
        CONSTRAINT [FK_tenant_members_tenant] FOREIGN KEY ([tenantId]) REFERENCES [tenants]([id]),
        CONSTRAINT [FK_tenant_members_user] FOREIGN KEY ([userId]) REFERENCES [users]([id])
      );
    `);

    await queryRunner.query(`
      CREATE TABLE [albums] (
        [id] uniqueidentifier NOT NULL CONSTRAINT [DF_albums_id] DEFAULT NEWID(),
        [tenantId] uniqueidentifier NOT NULL,
        [title] nvarchar(200) NOT NULL,
        [description] nvarchar(max) NULL,
        [coverMediaId] uniqueidentifier NULL,
        [visibility] nvarchar(40) NOT NULL CONSTRAINT [DF_albums_visibility] DEFAULT 'private',
        [passwordHash] nvarchar(500) NULL,
        [sortOrder] int NOT NULL CONSTRAINT [DF_albums_sortOrder] DEFAULT 0,
        [layoutType] nvarchar(60) NOT NULL CONSTRAINT [DF_albums_layoutType] DEFAULT 'grid',
        [themeOverrideJson] nvarchar(max) NULL,
        [allowDownload] bit NOT NULL CONSTRAINT [DF_albums_allowDownload] DEFAULT 0,
        [createdAt] datetime2 NOT NULL CONSTRAINT [DF_albums_createdAt] DEFAULT SYSUTCDATETIME(),
        [updatedAt] datetime2 NOT NULL CONSTRAINT [DF_albums_updatedAt] DEFAULT SYSUTCDATETIME(),
        [deletedAt] datetime2 NULL,
        CONSTRAINT [PK_albums] PRIMARY KEY ([id]),
        CONSTRAINT [FK_albums_tenant] FOREIGN KEY ([tenantId]) REFERENCES [tenants]([id])
      );
    `);
    await queryRunner.query(
      `CREATE INDEX [IX_albums_tenant_sort] ON [albums] ([tenantId], [sortOrder]);`,
    );

    await queryRunner.query(`
      CREATE TABLE [media] (
        [id] uniqueidentifier NOT NULL CONSTRAINT [DF_media_id] DEFAULT NEWID(),
        [tenantId] uniqueidentifier NOT NULL,
        [albumId] uniqueidentifier NOT NULL,
        [type] nvarchar(40) NOT NULL,
        [originalFileName] nvarchar(500) NOT NULL,
        [storedFileName] nvarchar(500) NOT NULL,
        [mimeType] nvarchar(160) NOT NULL,
        [sizeBytes] bigint NOT NULL,
        [width] int NULL,
        [height] int NULL,
        [durationSeconds] int NULL,
        [storageProvider] nvarchar(60) NOT NULL,
        [storageKey] nvarchar(1000) NOT NULL,
        [publicUrl] nvarchar(1000) NULL,
        [thumbnailUrl] nvarchar(1000) NULL,
        [optimizedUrl] nvarchar(1000) NULL,
        [blurHash] nvarchar(200) NULL,
        [title] nvarchar(200) NULL,
        [description] nvarchar(max) NULL,
        [takenAt] datetime2 NULL,
        [sortOrder] int NOT NULL CONSTRAINT [DF_media_sortOrder] DEFAULT 0,
        [metadataJson] nvarchar(max) NULL,
        [processingStatus] nvarchar(40) NOT NULL CONSTRAINT [DF_media_processingStatus] DEFAULT 'pending',
        [createdAt] datetime2 NOT NULL CONSTRAINT [DF_media_createdAt] DEFAULT SYSUTCDATETIME(),
        [updatedAt] datetime2 NOT NULL CONSTRAINT [DF_media_updatedAt] DEFAULT SYSUTCDATETIME(),
        [deletedAt] datetime2 NULL,
        CONSTRAINT [PK_media] PRIMARY KEY ([id]),
        CONSTRAINT [FK_media_tenant] FOREIGN KEY ([tenantId]) REFERENCES [tenants]([id]),
        CONSTRAINT [FK_media_album] FOREIGN KEY ([albumId]) REFERENCES [albums]([id])
      );
    `);
    await queryRunner.query(
      `CREATE INDEX [IX_media_tenant_album_sort] ON [media] ([tenantId], [albumId], [sortOrder]);`,
    );
    await queryRunner.query(
      `CREATE INDEX [IX_media_processingStatus] ON [media] ([processingStatus], [createdAt]);`,
    );
    await queryRunner.query(
      `ALTER TABLE [albums] ADD CONSTRAINT [FK_albums_coverMedia] FOREIGN KEY ([coverMediaId]) REFERENCES [media]([id]);`,
    );

    await queryRunner.query(`
      CREATE TABLE [media_versions] (
        [id] uniqueidentifier NOT NULL CONSTRAINT [DF_media_versions_id] DEFAULT NEWID(),
        [mediaId] uniqueidentifier NOT NULL,
        [versionType] nvarchar(40) NOT NULL,
        [storageKey] nvarchar(1000) NOT NULL,
        [url] nvarchar(1000) NULL,
        [metadataJson] nvarchar(max) NULL,
        [createdAt] datetime2 NOT NULL CONSTRAINT [DF_media_versions_createdAt] DEFAULT SYSUTCDATETIME(),
        CONSTRAINT [PK_media_versions] PRIMARY KEY ([id]),
        CONSTRAINT [FK_media_versions_media] FOREIGN KEY ([mediaId]) REFERENCES [media]([id])
      );
    `);
    await queryRunner.query(
      `CREATE INDEX [IX_media_versions_media_type] ON [media_versions] ([mediaId], [versionType]);`,
    );

    await queryRunner.query(`
      CREATE TABLE [themes] (
        [id] uniqueidentifier NOT NULL CONSTRAINT [DF_themes_id] DEFAULT NEWID(),
        [tenantId] uniqueidentifier NOT NULL,
        [name] nvarchar(160) NOT NULL,
        [primaryColor] nvarchar(40) NOT NULL,
        [secondaryColor] nvarchar(40) NOT NULL,
        [backgroundColor] nvarchar(40) NOT NULL,
        [textColor] nvarchar(40) NOT NULL,
        [fontFamily] nvarchar(160) NOT NULL,
        [layoutType] nvarchar(60) NOT NULL,
        [animationType] nvarchar(60) NULL,
        [customCss] nvarchar(max) NULL,
        [configJson] nvarchar(max) NULL,
        [isActive] bit NOT NULL CONSTRAINT [DF_themes_isActive] DEFAULT 0,
        [createdAt] datetime2 NOT NULL CONSTRAINT [DF_themes_createdAt] DEFAULT SYSUTCDATETIME(),
        [updatedAt] datetime2 NOT NULL CONSTRAINT [DF_themes_updatedAt] DEFAULT SYSUTCDATETIME(),
        CONSTRAINT [PK_themes] PRIMARY KEY ([id]),
        CONSTRAINT [FK_themes_tenant] FOREIGN KEY ([tenantId]) REFERENCES [tenants]([id])
      );
    `);
    await queryRunner.query(
      `CREATE INDEX [IX_themes_tenant_active] ON [themes] ([tenantId], [isActive]);`,
    );

    await queryRunner.query(`
      CREATE TABLE [audit_logs] (
        [id] uniqueidentifier NOT NULL CONSTRAINT [DF_audit_logs_id] DEFAULT NEWID(),
        [actorUserId] uniqueidentifier NULL,
        [tenantId] uniqueidentifier NULL,
        [action] nvarchar(160) NOT NULL,
        [entityType] nvarchar(120) NOT NULL,
        [entityId] uniqueidentifier NULL,
        [metadataJson] nvarchar(max) NULL,
        [ipAddress] nvarchar(80) NULL,
        [userAgent] nvarchar(1000) NULL,
        [createdAt] datetime2 NOT NULL CONSTRAINT [DF_audit_logs_createdAt] DEFAULT SYSUTCDATETIME(),
        CONSTRAINT [PK_audit_logs] PRIMARY KEY ([id]),
        CONSTRAINT [FK_audit_logs_actor] FOREIGN KEY ([actorUserId]) REFERENCES [users]([id]),
        CONSTRAINT [FK_audit_logs_tenant] FOREIGN KEY ([tenantId]) REFERENCES [tenants]([id])
      );
    `);
    await queryRunner.query(
      `CREATE INDEX [IX_audit_logs_tenant_createdAt] ON [audit_logs] ([tenantId], [createdAt]);`,
    );
    await queryRunner.query(
      `CREATE INDEX [IX_audit_logs_action_createdAt] ON [audit_logs] ([action], [createdAt]);`,
    );

    await queryRunner.query(`
      CREATE TABLE [system_settings] (
        [id] uniqueidentifier NOT NULL CONSTRAINT [DF_system_settings_id] DEFAULT NEWID(),
        [key] nvarchar(160) NOT NULL,
        [valueJson] nvarchar(max) NOT NULL,
        [description] nvarchar(500) NULL,
        [createdAt] datetime2 NOT NULL CONSTRAINT [DF_system_settings_createdAt] DEFAULT SYSUTCDATETIME(),
        [updatedAt] datetime2 NOT NULL CONSTRAINT [DF_system_settings_updatedAt] DEFAULT SYSUTCDATETIME(),
        CONSTRAINT [PK_system_settings] PRIMARY KEY ([id]),
        CONSTRAINT [UQ_system_settings_key] UNIQUE ([key])
      );
    `);

    await queryRunner.query(`
      CREATE TABLE [storage_usage] (
        [id] uniqueidentifier NOT NULL CONSTRAINT [DF_storage_usage_id] DEFAULT NEWID(),
        [tenantId] uniqueidentifier NOT NULL,
        [usedBytes] bigint NOT NULL CONSTRAINT [DF_storage_usage_usedBytes] DEFAULT 0,
        [fileCount] int NOT NULL CONSTRAINT [DF_storage_usage_fileCount] DEFAULT 0,
        [updatedAt] datetime2 NOT NULL CONSTRAINT [DF_storage_usage_updatedAt] DEFAULT SYSUTCDATETIME(),
        CONSTRAINT [PK_storage_usage] PRIMARY KEY ([id]),
        CONSTRAINT [UQ_storage_usage_tenant] UNIQUE ([tenantId]),
        CONSTRAINT [FK_storage_usage_tenant] FOREIGN KEY ([tenantId]) REFERENCES [tenants]([id])
      );
    `);

    await queryRunner.query(`
      CREATE TABLE [feature_flags] (
        [id] uniqueidentifier NOT NULL CONSTRAINT [DF_feature_flags_id] DEFAULT NEWID(),
        [key] nvarchar(160) NOT NULL,
        [description] nvarchar(500) NULL,
        [enabled] bit NOT NULL CONSTRAINT [DF_feature_flags_enabled] DEFAULT 0,
        [rulesJson] nvarchar(max) NULL,
        [createdAt] datetime2 NOT NULL CONSTRAINT [DF_feature_flags_createdAt] DEFAULT SYSUTCDATETIME(),
        [updatedAt] datetime2 NOT NULL CONSTRAINT [DF_feature_flags_updatedAt] DEFAULT SYSUTCDATETIME(),
        CONSTRAINT [PK_feature_flags] PRIMARY KEY ([id]),
        CONSTRAINT [UQ_feature_flags_key] UNIQUE ([key])
      );
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE [feature_flags];`);
    await queryRunner.query(`DROP TABLE [storage_usage];`);
    await queryRunner.query(`DROP TABLE [system_settings];`);
    await queryRunner.query(`DROP TABLE [audit_logs];`);
    await queryRunner.query(`DROP TABLE [themes];`);
    await queryRunner.query(`DROP TABLE [media_versions];`);
    await queryRunner.query(`ALTER TABLE [albums] DROP CONSTRAINT [FK_albums_coverMedia];`);
    await queryRunner.query(`DROP TABLE [media];`);
    await queryRunner.query(`DROP TABLE [albums];`);
    await queryRunner.query(`DROP TABLE [tenant_members];`);
    await queryRunner.query(`DROP TABLE [tenants];`);
    await queryRunner.query(`DROP TABLE [role_permissions];`);
    await queryRunner.query(`DROP TABLE [user_roles];`);
    await queryRunner.query(`DROP TABLE [permissions];`);
    await queryRunner.query(`DROP TABLE [roles];`);
    await queryRunner.query(`DROP TABLE [email_verification_tokens];`);
    await queryRunner.query(`DROP TABLE [password_reset_tokens];`);
    await queryRunner.query(`DROP TABLE [user_login_histories];`);
    await queryRunner.query(`DROP TABLE [user_sessions];`);
    await queryRunner.query(`DROP TABLE [users];`);
  }
}
