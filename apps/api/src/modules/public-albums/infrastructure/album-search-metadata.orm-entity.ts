import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('album_search_metadata')
export class AlbumSearchMetadataOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  tenantId!: string;

  @Column({ type: 'uuid' })
  albumId!: string;

  @Column({ nullable: true, type: 'int' })
  ageMin!: number | null;

  @Column({ nullable: true, type: 'int' })
  ageMax!: number | null;

  @Column({ length: 120, nullable: true, type: 'varchar' })
  region!: string | null;

  @Column({ length: 200, nullable: true, type: 'varchar' })
  venue!: string | null;

  @Column({ length: 120, nullable: true, type: 'varchar' })
  theme!: string | null;

  @Column({ nullable: true, type: 'timestamptz' })
  eventDate!: Date | null;

  @Column({ type: 'boolean' })
  ownerOptIn!: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
