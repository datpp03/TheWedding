import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('studio_clients')
export class StudioClientOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  studioProfileId!: string;

  @Column({ nullable: true, type: 'uuid' })
  tenantId!: string | null;

  @Column({ length: 200 })
  displayName!: string;

  @Column({ length: 320, nullable: true, type: 'varchar' })
  email!: string | null;

  @Column({ length: 40 })
  status!: string;

  @Column({ nullable: true, type: 'text' })
  notes!: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
