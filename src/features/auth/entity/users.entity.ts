import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Roles } from './roles.entity';

@Entity({ schema: 'auth', name: 'users' })
export class Users {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    name: 'identifier',
    nullable: false,
    unique: true,
    type: 'uuid',
  })
  identifier!: string;

  @Column('character varying', {
    name: 'email',
    nullable: false,
    unique: true,
    length: 200,
  })
  email!: string;

  @Column({
    name: 'password',
    nullable: false,
    length: 255,
  })
  password!: string;

  @Column({
    name: 'first_name',
    nullable: true,
  })
  firstName!: string;

  @Column({
    name: 'last_name',
    nullable: true,
  })
  lastName!: string;

  @Column({
    name: 'is_active',
    default: true,
  })
  isActive!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToMany(() => Roles, (role) => role.users)
  @JoinTable({
    name: 'user_roles',
    schema: 'auth',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles!: Roles[];
}
