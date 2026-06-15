import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLogOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: true, type: 'uuid' })
  actorUserId!: string | null;

  @Column({ nullable: true, type: 'uuid' })
  tenantId!: string | null;

  @Column({ length: 160 })
  action!: string;

  @Column({ length: 120 })
  entityType!: string;

  @Column({ nullable: true, type: 'uuid' })
  entityId!: string | null;

  @Column({ nullable: true, type: 'text' })
  metadataJson!: string | null;

  @Column({ length: 80, nullable: true, type: 'varchar' })
  ipAddress!: string | null;

  @Column({ length: 1000, nullable: true, type: 'varchar' })
  userAgent!: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
