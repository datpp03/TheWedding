import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('payment_events')
export class PaymentEventOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 40 })
  provider!: string;

  @Column({ length: 160 })
  providerEventId!: string;

  @Column({ length: 80 })
  eventType!: string;

  @Column({ length: 40 })
  status!: string;

  @Column({ nullable: true, type: 'bigint' })
  amount!: string | null;

  @Column({ length: 10, nullable: true, type: 'varchar' })
  currency!: string | null;

  @Column({ nullable: true, type: 'text' })
  metadataJson!: string | null;

  @Column({ nullable: true, type: 'timestamptz' })
  processedAt!: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
