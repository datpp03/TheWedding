import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tenants')
export class TenantOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uniqueidentifier' })
  ownerUserId!: string;

  @Column({ length: 120 })
  slug!: string;

  @Column({ length: 200 })
  siteName!: string;

  @Column({ length: 160, nullable: true, type: 'nvarchar' })
  brideName!: string | null;

  @Column({ length: 160, nullable: true, type: 'nvarchar' })
  groomName!: string | null;

  @Column({ nullable: true, type: 'date' })
  weddingDate!: string | null;

  @Column({ nullable: true, type: 'nvarchar' })
  description!: string | null;

  @Column({ length: 40 })
  visibility!: string;

  @Column({ length: 500, nullable: true, type: 'nvarchar' })
  passwordHash!: string | null;

  @Column({ length: 255, nullable: true, type: 'nvarchar' })
  customDomain!: string | null;

  @Column({ length: 40 })
  status!: string;

  @Column({ nullable: true, type: 'nvarchar' })
  settingsJson!: string | null;

  @Column({ nullable: true, type: 'nvarchar' })
  seoJson!: string | null;

  @Column({ nullable: true, type: 'nvarchar' })
  sharingJson!: string | null;

  @CreateDateColumn({ type: 'datetime2' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime2' })
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true, type: 'datetime2' })
  deletedAt!: Date | null;
}
