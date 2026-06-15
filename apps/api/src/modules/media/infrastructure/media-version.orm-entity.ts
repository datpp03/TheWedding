import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('media_versions')
export class MediaVersionOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  mediaId!: string;

  @Column({ length: 40 })
  versionType!: string;

  @Column({ length: 1000 })
  storageKey!: string;

  @Column({ length: 1000, nullable: true, type: 'varchar' })
  url!: string | null;

  @Column({ nullable: true, type: 'text' })
  metadataJson!: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
