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

  @Column({ type: 'uuid' })
  ownerUserId!: string;

  @Column({ length: 120 })
  slug!: string;

  @Column({ length: 200 })
  siteName!: string;

  @Column({ length: 160, nullable: true, type: 'varchar' })
  brideName!: string | null;

  @Column({ length: 160, nullable: true, type: 'varchar' })
  groomName!: string | null;

  @Column({ nullable: true, type: 'date' })
  weddingDate!: string | null;

  @Column({ nullable: true, type: 'text' })
  description!: string | null;

  @Column({ length: 40 })
  visibility!: string;

  @Column({ length: 500, nullable: true, type: 'varchar' })
  passwordHash!: string | null;

  @Column({ length: 255, nullable: true, type: 'varchar' })
  customDomain!: string | null;

  @Column({ length: 40 })
  status!: string;

  @Column({ nullable: true, type: 'text' })
  settingsJson!: string | null;

  @Column({ nullable: true, type: 'text' })
  seoJson!: string | null;

  @Column({ nullable: true, type: 'text' })
  sharingJson!: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true, type: 'timestamptz' })
  deletedAt!: Date | null;
}
