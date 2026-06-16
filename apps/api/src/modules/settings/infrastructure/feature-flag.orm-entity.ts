import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('feature_flags')
export class FeatureFlagOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 160 })
  key!: string;

  @Column({ length: 500, nullable: true, type: 'varchar' })
  description!: string | null;

  @Column({ type: 'boolean' })
  enabled!: boolean;

  @Column({ nullable: true, type: 'text' })
  rulesJson!: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
