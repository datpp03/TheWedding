import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_login_histories')
export class UserLoginHistoryOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: true, type: 'uuid' })
  userId!: string | null;

  @Column({ length: 320 })
  email!: string;

  @Column()
  success!: boolean;

  @Column({ length: 200, nullable: true, type: 'varchar' })
  failureReason!: string | null;

  @Column({ length: 80, nullable: true, type: 'varchar' })
  ipAddress!: string | null;

  @Column({ length: 1000, nullable: true, type: 'varchar' })
  userAgent!: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
