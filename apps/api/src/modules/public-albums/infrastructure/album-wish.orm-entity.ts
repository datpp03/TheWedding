import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('album_wishes')
export class AlbumWishOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  tenantId!: string;

  @Column({ type: 'uuid' })
  albumId!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ length: 200 })
  displayNameSnapshot!: string;

  @Column({ type: 'text' })
  message!: string;

  @Column({ length: 40 })
  status!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true, type: 'timestamptz' })
  deletedAt!: Date | null;
}
