import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserSessionOrmEntity } from '../../auth/infrastructure/user-session.orm-entity';

@Entity('users')
export class UserOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 320 })
  email!: string;

  @Column({ length: 500 })
  passwordHash!: string;

  @Column({ length: 200 })
  displayName!: string;

  @Column({ length: 1000, nullable: true, type: 'varchar' })
  avatarUrl!: string | null;

  @Column({ length: 40 })
  status!: string;

  @Column({ nullable: true, type: 'timestamptz' })
  emailVerifiedAt!: Date | null;

  @Column({ nullable: true, type: 'timestamptz' })
  lockedUntil!: Date | null;

  @Column({ nullable: true, type: 'timestamptz' })
  mfaEnabledAt!: Date | null;

  @Column({ length: 40, nullable: true, type: 'varchar' })
  mfaMethod!: string | null;

  @Column({ nullable: true, type: 'text' })
  mfaSecretEncrypted!: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true, type: 'timestamptz' })
  deletedAt!: Date | null;

  @OneToMany(() => UserSessionOrmEntity, (session) => session.user)
  sessions!: UserSessionOrmEntity[];
}
