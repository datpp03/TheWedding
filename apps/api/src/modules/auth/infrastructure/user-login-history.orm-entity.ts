import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_login_histories')
export class UserLoginHistoryOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: true, type: 'uniqueidentifier' })
  userId!: string | null;

  @Column({ length: 320 })
  email!: string;

  @Column()
  success!: boolean;

  @Column({ length: 200, nullable: true, type: 'nvarchar' })
  failureReason!: string | null;

  @Column({ length: 80, nullable: true, type: 'nvarchar' })
  ipAddress!: string | null;

  @Column({ length: 1000, nullable: true, type: 'nvarchar' })
  userAgent!: string | null;

  @CreateDateColumn({ type: 'datetime2' })
  createdAt!: Date;
}
