import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('entitlements')
export class EntitlementOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 20 })
  subjectType!: 'tenant' | 'user';

  @Column({ type: 'uuid' })
  subjectId!: string;

  @Column({ length: 80, nullable: true, type: 'varchar' })
  featureKey!: string | null;

  @Column({ type: 'bigint', default: 0 })
  storageBoostBytes!: string;

  @Column({ type: 'boolean', default: true })
  granted!: boolean;

  @Column({ nullable: true, type: 'text' })
  reason!: string | null;

  @Column({ nullable: true, type: 'uuid' })
  grantedByUserId!: string | null;

  @Column({ nullable: true, type: 'timestamptz' })
  startsAt!: Date | null;

  @Column({ nullable: true, type: 'timestamptz' })
  expiresAt!: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
