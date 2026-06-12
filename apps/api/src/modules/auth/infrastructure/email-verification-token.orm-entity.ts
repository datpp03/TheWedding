import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('email_verification_tokens')
export class EmailVerificationTokenOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uniqueidentifier' })
  userId!: string;

  @Column({ length: 500 })
  tokenHash!: string;

  @Column({ type: 'datetime2' })
  expiresAt!: Date;

  @Column({ nullable: true, type: 'datetime2' })
  usedAt!: Date | null;

  @CreateDateColumn({ type: 'datetime2' })
  createdAt!: Date;
}
