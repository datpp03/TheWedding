import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLogOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: true, type: 'uniqueidentifier' })
  actorUserId!: string | null;

  @Column({ nullable: true, type: 'uniqueidentifier' })
  tenantId!: string | null;

  @Column({ length: 160 })
  action!: string;

  @Column({ length: 120 })
  entityType!: string;

  @Column({ nullable: true, type: 'uniqueidentifier' })
  entityId!: string | null;

  @Column({ nullable: true, type: 'nvarchar' })
  metadataJson!: string | null;

  @Column({ length: 80, nullable: true, type: 'nvarchar' })
  ipAddress!: string | null;

  @Column({ length: 1000, nullable: true, type: 'nvarchar' })
  userAgent!: string | null;

  @CreateDateColumn({ type: 'datetime2' })
  createdAt!: Date;
}
