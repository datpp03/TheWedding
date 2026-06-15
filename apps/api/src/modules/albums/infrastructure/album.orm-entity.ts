import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('albums')
export class AlbumOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  tenantId!: string;

  @Column({ length: 200 })
  title!: string;

  @Column({ nullable: true, type: 'text' })
  description!: string | null;

  @Column({ nullable: true, type: 'uuid' })
  coverMediaId!: string | null;

  @Column({ length: 40 })
  visibility!: string;

  @Column({ length: 500, nullable: true, type: 'varchar' })
  passwordHash!: string | null;

  @Column({ type: 'int' })
  sortOrder!: number;

  @Column({ length: 60 })
  layoutType!: string;

  @Column({ nullable: true, type: 'text' })
  themeOverrideJson!: string | null;

  @Column({ type: 'boolean' })
  allowDownload!: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true, type: 'timestamptz' })
  deletedAt!: Date | null;
}
