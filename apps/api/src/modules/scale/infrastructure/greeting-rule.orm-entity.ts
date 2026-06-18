import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('greeting_rules')
export class GreetingRuleOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 20 })
  scopeType!: 'global' | 'tenant' | 'user';

  @Column({ nullable: true, type: 'uuid' })
  scopeId!: string | null;

  @Column({ length: 60 })
  triggerType!: string;

  @Column({ length: 10 })
  locale!: string;

  @Column({ length: 160 })
  templateKey!: string;

  @Column({ nullable: true, type: 'int' })
  dateMonth!: number | null;

  @Column({ nullable: true, type: 'int' })
  dateDay!: number | null;

  @Column({ nullable: true, type: 'date' })
  customDate!: string | null;

  @Column({ type: 'boolean', default: false })
  enabled!: boolean;

  @Column({ nullable: true, type: 'uuid' })
  createdByUserId!: string | null;

  @Column({ nullable: true, type: 'text' })
  metadataJson!: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
