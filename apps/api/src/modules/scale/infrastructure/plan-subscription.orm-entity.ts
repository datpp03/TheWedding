import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('plan_subscriptions')
export class PlanSubscriptionOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: true, type: 'uuid' })
  tenantId!: string | null;

  @Column({ nullable: true, type: 'uuid' })
  userId!: string | null;

  @Column({ length: 80 })
  planId!: string;

  @Column({ length: 40 })
  segment!: string;

  @Column({ length: 40 })
  status!: string;

  @Column({ length: 40, nullable: true, type: 'varchar' })
  provider!: string | null;

  @Column({ length: 160, nullable: true, type: 'varchar' })
  providerSubscriptionId!: string | null;

  @Column({ nullable: true, type: 'timestamptz' })
  currentPeriodEndsAt!: Date | null;

  @Column({ nullable: true, type: 'text' })
  metadataJson!: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
