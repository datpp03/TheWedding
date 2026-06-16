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

  @Column({ type: 'uuid' })
  tenantId!: string;

  @Column({ type: 'uuid' })
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

  @Column({ length: 1000, nullable: true, type: 'varchar' })
  publicUrl!: string | null;

  @Column({ length: 1000, nullable: true, type: 'varchar' })
  thumbnailUrl!: string | null;

  @Column({ length: 1000, nullable: true, type: 'varchar' })
  optimizedUrl!: string | null;

  @Column({ length: 200, nullable: true, type: 'varchar' })
  blurHash!: string | null;

  @Column({ length: 200, nullable: true, type: 'varchar' })
  title!: string | null;

  @Column({ nullable: true, type: 'text' })
  description!: string | null;

  @Column({ nullable: true, type: 'timestamptz' })
  takenAt!: Date | null;

  @Column({ type: 'int' })
  sortOrder!: number;

  @Column({ nullable: true, type: 'text' })
  metadataJson!: string | null;

  @Column({ length: 40 })
  processingStatus!: string;

  @Column({ nullable: true, type: 'text' })
  processingFailureReason!: string | null;

  @Column({ type: 'int', default: 0 })
  processingAttempts!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true, type: 'timestamptz' })
  deletedAt!: Date | null;
}
