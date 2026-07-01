import { MigrationInterface, QueryRunner } from 'typeorm';

type AlbumSlugRow = {
  id: string;
  title: string;
};

export class NormalizeAlbumVietnameseSlugs1710000012000 implements MigrationInterface {
  name = 'NormalizeAlbumVietnameseSlugs1710000012000';

  async up(queryRunner: QueryRunner): Promise<void> {
    const rows = (await queryRunner.query(`
      SELECT "id", "title"
      FROM "albums"
      WHERE "deletedAt" IS NULL
      ORDER BY "createdAt" ASC, "id" ASC;
    `)) as unknown;
    const seen = new Set<string>();

    if (!Array.isArray(rows)) return;

    for (const row of rows) {
      if (!isAlbumSlugRow(row)) continue;
      const album = row;
      const base = createSlug(album.title, album.id);
      let slug = base;
      let suffix = 2;
      while (seen.has(slug)) {
        slug = `${base}-${suffix}`;
        suffix += 1;
      }
      seen.add(slug);
      await queryRunner.query(`UPDATE "albums" SET "slug" = $1 WHERE "id" = $2`, [slug, album.id]);
    }
  }

  async down(): Promise<void> {
    // Slug normalization is data repair; keep readable URLs on rollback.
  }
}

function createSlug(title: string, albumId: string) {
  const base = slugify(title);
  return `${base}-${albumId.slice(0, 8)}`;
}

function slugify(value: string) {
  const slug = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 180);
  return slug || 'album';
}

function isAlbumSlugRow(value: unknown): value is AlbumSlugRow {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return typeof record.id === 'string' && typeof record.title === 'string';
}
