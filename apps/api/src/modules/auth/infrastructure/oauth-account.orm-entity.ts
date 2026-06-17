import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('oauth_accounts')
export class OAuthAccountOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ length: 40 })
  provider!: string;

  @Column({ length: 200 })
  providerSubject!: string;

  @Column({ length: 320, nullable: true, type: 'varchar' })
  verifiedEmail!: string | null;

  @Column({ length: 40 })
  status!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
