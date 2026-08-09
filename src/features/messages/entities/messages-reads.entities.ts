import { Schemas } from '@src/common/database/database.constants';
import { Users } from '@src/features/auth/entity/users.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Messages } from './messages.entities';

@Entity({ schema: Schemas.MESSAGING, name: 'message_reads' })
export class MessageReads {
  @PrimaryColumn({ name: 'message_id' })
  messageId!: number;

  @PrimaryColumn({ name: 'user_id' })
  userId!: number;

  @CreateDateColumn({ name: 'seen_at' })
  seenAt!: Date;

  @ManyToOne(() => Messages, (message) => message.reads, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'message_id' })
  message!: Messages;

  @ManyToOne(() => Users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: Users;
}
