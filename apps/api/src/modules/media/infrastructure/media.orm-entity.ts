import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('media')
export class MediaOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uniqueidentifier' })
  tenantId!: string;

  @Column({ type: 'uniqueidentifier' })
  albumId!: string;

  @Column({ length: 40 })
  type!: string;

  @Column({ length: 500 })
  originalFileName!: string;

  @Column({ length: 500 })
  storedFileName!: string;

  @Column({ length: 160 })
  mimeType!: string;

  @Column({ type: 'bigint' })
  sizeBytes!: string;

  @Column({ nullable: true, type: 'int' })
  width!: number | null;

  @Column({ nullable: true, type: 'int' })
  height!: number | null;

  @Column({ nullable: true, type: 'int' })
  durationSeconds!: number | null;

  @Column({ length: 60 })
  storageProvider!: string;

  @Column({ length: 1000 })
  storageKey!: string;

  @Column({ length: 1000, nullable: true, type: 'nvarchar' })
  publicUrl!: string | null;

  @Column({ length: 1000, nullable: true, type: 'nvarchar' })
  thumbnailUrl!: string | null;

  @Column({ length: 1000, nullable: true, type: 'nvarchar' })
  optimizedUrl!: string | null;

  @Column({ length: 200, nullable: true, type: 'nvarchar' })
  blurHash!: string | null;

  @Column({ length: 200, nullable: true, type: 'nvarchar' })
  title!: string | null;

  @Column({ nullable: true, type: 'nvarchar' })
  description!: string | null;

  @Column({ nullable: true, type: 'datetime2' })
  takenAt!: Date | null;

  @Column({ type: 'int' })
  sortOrder!: number;

  @Column({ nullable: true, type: 'nvarchar' })
  metadataJson!: string | null;

  @Column({ length: 40 })
  processingStatus!: string;

  @CreateDateColumn({ type: 'datetime2' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime2' })
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true, type: 'datetime2' })
  deletedAt!: Date | null;
}
