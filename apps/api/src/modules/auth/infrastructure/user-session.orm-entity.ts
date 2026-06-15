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

  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ length: 500 })
  refreshTokenHash!: string;

  @Column({ type: 'uuid' })
  refreshTokenFamilyId!: string;

  @Column({ length: 200, nullable: true, type: 'varchar' })
  deviceName!: string | null;

  @Column({ length: 80, nullable: true, type: 'varchar' })
  ipAddress!: string | null;

  @Column({ length: 1000, nullable: true, type: 'varchar' })
  userAgent!: string | null;

  @Column({ type: 'timestamptz' })
  expiresAt!: Date;

  @Column({ nullable: true, type: 'timestamptz' })
  revokedAt!: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @ManyToOne(() => UserOrmEntity, (user) => user.sessions)
  @JoinColumn({ name: 'userId' })
  user!: UserOrmEntity;
}
