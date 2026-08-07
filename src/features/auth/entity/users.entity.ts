import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Roles } from './roles.entity';

@Entity({ schema: 'auth', name: 'users' })
export class Users {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'identifier', nullable: false, unique: true, type: 'uuid' })
  identifier!: string;

  @Column({ name: 'email', nullable: false, unique: true })
  email!: string;

  @Column({ name: 'password', nullable: false })
  password!: string;

  @Column({ name: 'first_name', nullable: true })
  firstName!: string;

  @Column({ name: 'last_name', nullable: true })
  lastName!: string;

  @Column({ name: 'is_active', default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToMany(() => Roles, (role) => role.users)
  roles!: Roles[];
}
