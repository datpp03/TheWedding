import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('media_versions')
@Unique('UQ_media_versions_media_type', ['mediaId', 'versionType'])
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
