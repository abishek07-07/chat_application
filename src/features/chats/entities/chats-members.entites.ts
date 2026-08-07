import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { Schemas } from '@src/common/database/database.constants';
import { Chats } from './chat.entities';
import { Users } from '@src/features/auth/entity/users.entity';

@Entity({
  schema: Schemas.MESSAGING,
  name: 'chat_members',
})
export class ChatMembers {
  @PrimaryColumn({ name: 'chat_id' })
  chatId!: number;

  @PrimaryColumn({ name: 'user_id' })
  userId!: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  alias?: string;

  @Column({
    name: 'is_admin',
    default: false,
  })
  isAdmin!: boolean;

  @CreateDateColumn({
    name: 'joined_at',
  })
  joinedAt!: Date;

  @Column({
    name: 'left_at',
    type: 'timestamp',
    nullable: true,
  })
  leftAt?: Date;

  @ManyToOne(() => Chats, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chat_id' })
  chat!: Chats;

  @ManyToOne(() => Users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: Users;
}
