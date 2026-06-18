import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('custom_domains')
export class CustomDomainOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  tenantId!: string;

  @Column({ length: 255 })
  domain!: string;

  @Column({ length: 40 })
  verificationStatus!: string;

  @Column({ length: 160 })
  verificationToken!: string;

  @Column({ nullable: true, type: 'timestamptz' })
  lastCheckedAt!: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
