import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('album_featured_entries')
export class AlbumFeaturedEntryOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  tenantId!: string;

  @Column({ type: 'uuid' })
  albumId!: string;

  @Column({ length: 20 })
  window!: string;

  @Column({ length: 40 })
  source!: string;

  @Column({ type: 'int' })
  score!: number;

  @Column({ nullable: true, type: 'text' })
  metadataJson!: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
