import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Roles } from './roles.entity';

@Entity({ schema: 'auth', name: 'permissions' })
@Unique(['resource', 'action'])
export class Permissions {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'name', nullable: false, unique: true, length: 100 })
  name!: string;

  @Column({ name: 'description', nullable: true, length: 255 })
  description!: string;

  @Column({ name: 'resource', nullable: false, length: 50 })
  resource!: string;

  @Column({ name: 'action', nullable: false, length: 50 })
  action!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToMany(() => Roles, (role) => role.permissions)
  roles!: Roles[];
}