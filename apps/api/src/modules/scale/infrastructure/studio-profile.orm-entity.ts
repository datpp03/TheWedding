import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('studio_profiles')
export class StudioProfileOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  ownerUserId!: string;

  @Column({ length: 200 })
  displayName!: string;

  @Column({ length: 40 })
  status!: string;

  @Column({ length: 80, nullable: true, type: 'varchar' })
  planId!: string | null;

  @Column({ nullable: true, type: 'text' })
  brandingJson!: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
