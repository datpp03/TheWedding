import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserOrmEntity } from '../../users/infrastructure/user.orm-entity';

@Entity('user_sessions')
export class UserSessionOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column({ length: 500 })
  refreshTokenHash!: string;

  @Column()
  refreshTokenFamilyId!: string;

  @Column({ length: 200, nullable: true, type: 'nvarchar' })
  deviceName!: string | null;

  @Column({ length: 80, nullable: true, type: 'nvarchar' })
  ipAddress!: string | null;

  @Column({ length: 1000, nullable: true, type: 'nvarchar' })
  userAgent!: string | null;

  @Column({ type: 'datetime2' })
  expiresAt!: Date;

  @Column({ nullable: true, type: 'datetime2' })
  revokedAt!: Date | null;

  @CreateDateColumn({ type: 'datetime2' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime2' })
  updatedAt!: Date;

  @ManyToOne(() => UserOrmEntity, (user) => user.sessions)
  @JoinColumn({ name: 'userId' })
  user!: UserOrmEntity;
}
