import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('analytics_events')
export class AnalyticsEventOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  tenantId!: string;

  @Column({ nullable: true, type: 'uuid' })
  albumId!: string | null;

  @Column({ nullable: true, type: 'uuid' })
  mediaId!: string | null;

  @Column({ length: 60 })
  eventType!: string;

  @Column({ nullable: true, type: 'uuid' })
  actorUserId!: string | null;

  @Column({ nullable: true, type: 'text' })
  metadataJson!: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
