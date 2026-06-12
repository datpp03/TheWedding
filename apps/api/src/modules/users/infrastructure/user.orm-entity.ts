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

  @Column({ length: 1000, nullable: true, type: 'nvarchar' })
  avatarUrl!: string | null;

  @Column({ length: 40 })
  status!: string;

  @Column({ nullable: true, type: 'datetime2' })
  emailVerifiedAt!: Date | null;

  @Column({ nullable: true, type: 'datetime2' })
  lockedUntil!: Date | null;

  @CreateDateColumn({ type: 'datetime2' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime2' })
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true, type: 'datetime2' })
  deletedAt!: Date | null;

  @OneToMany(() => UserSessionOrmEntity, (session) => session.user)
  sessions!: UserSessionOrmEntity[];
}
