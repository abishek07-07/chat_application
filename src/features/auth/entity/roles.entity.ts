import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Users } from './users.entity';
import { Permissions } from './permissions.entity';

@Entity({ schema: 'auth', name: 'roles' })
export class Roles {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    name: 'name',
    nullable: false,
    unique: true,
    length: 100,
  })
  name!: string;

  @Column({
    name: 'abbreviation',
    nullable: false,
    unique: true,
    length: 20,
  })
  abbrevation!: string;

  @Column({
    name: 'description',
    nullable: true,
    length: 255,
  })
  description?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToMany(() => Users, (user) => user.roles)
  users!: Users[];

  @ManyToMany(() => Permissions, (permission) => permission.roles)
  @JoinTable({
    name: 'role_permissions',
    schema: 'auth',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
  })
  permissions!: Permissions[];
}
