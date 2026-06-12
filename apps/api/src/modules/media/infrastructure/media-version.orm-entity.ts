import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('media_versions')
export class MediaVersionOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uniqueidentifier' })
  mediaId!: string;

  @Column({ length: 40 })
  versionType!: string;

  @Column({ length: 1000 })
  storageKey!: string;

  @Column({ length: 1000, nullable: true, type: 'nvarchar' })
  url!: string | null;

  @Column({ nullable: true, type: 'nvarchar' })
  metadataJson!: string | null;

  @CreateDateColumn({ type: 'datetime2' })
  createdAt!: Date;
}
