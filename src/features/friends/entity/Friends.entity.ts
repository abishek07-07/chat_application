import { Schemas } from '@src/common/database/database.constants';
import { Users } from '@src/features/auth/entity/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: Schemas.MESSAGING, name: 'friends' })
@Unique(['userId', 'friendId'])
export class Friends {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'user_id', type: 'integer', nullable: false })
  userId!: number;

  @ManyToOne(() => Users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: Users;

  @Column({ name: 'friend_id', type: 'integer', nullable: false })
  friendId!: number;

  @ManyToOne(() => Users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'friend_id' })
  friend!: Users;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
