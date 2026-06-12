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

  @Column({ type: 'uniqueidentifier' })
  tenantId!: string;

  @Column({ length: 200 })
  title!: string;

  @Column({ nullable: true, type: 'nvarchar' })
  description!: string | null;

  @Column({ nullable: true, type: 'uniqueidentifier' })
  coverMediaId!: string | null;

  @Column({ length: 40 })
  visibility!: string;

  @Column({ length: 500, nullable: true, type: 'nvarchar' })
  passwordHash!: string | null;

  @Column({ type: 'int' })
  sortOrder!: number;

  @Column({ length: 60 })
  layoutType!: string;

  @Column({ nullable: true, type: 'nvarchar' })
  themeOverrideJson!: string | null;

  @Column({ type: 'bit' })
  allowDownload!: boolean;

  @CreateDateColumn({ type: 'datetime2' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime2' })
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true, type: 'datetime2' })
  deletedAt!: Date | null;
}
