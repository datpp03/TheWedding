import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('themes')
export class ThemeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  tenantId!: string;

  @Column({ length: 160 })
  name!: string;

  @Column({ length: 40 })
  primaryColor!: string;

  @Column({ length: 40 })
  secondaryColor!: string;

  @Column({ length: 40 })
  backgroundColor!: string;

  @Column({ length: 40 })
  textColor!: string;

  @Column({ length: 160 })
  fontFamily!: string;

  @Column({ length: 60 })
  layoutType!: string;

  @Column({ length: 60, nullable: true, type: 'varchar' })
  animationType!: string | null;

  @Column({ nullable: true, type: 'text' })
  customCss!: string | null;

  @Column({ nullable: true, type: 'text' })
  configJson!: string | null;

  @Column()
  isActive!: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
