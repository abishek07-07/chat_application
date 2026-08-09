import { Schemas } from '@src/common/database/database.constants';
import { Users } from '@src/features/auth/entity/users.entity';
import { Chats } from '@src/features/chats/entities/chat.entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MessageReads } from './messages-reads.entities';

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
}

@Entity({ schema: Schemas.MESSAGING, name: 'messages' })
export class Messages {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int', { name: 'chat_id' })
  chatId!: number;

  @Column('int', { name: 'sender_id', nullable: false })
  senderId!: number;

  @Column('enum', { enum: MessageType, default: MessageType.TEXT })
  type!: MessageType;

  @Column('text', { name: 'message', nullable: true })
  message?: string;

  @Column('text', { name: 'attachment_url', nullable: true })
  attachmentUrl?: string;

  @CreateDateColumn({ name: 'sent_at' })
  sentAt!: Date;

  @Column({ name: 'is_deleted', default: false })
  isDeleted!: boolean;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @Column({ name: 'is_edited', default: false })
  isEdited!: boolean;

  @Column({ name: 'edited_at', type: 'timestamp', nullable: true })
  editedAt?: Date;

  @Column('int', { name: 'reply_to_message_id', nullable: true })
  replyToMessageId?: number;

  @ManyToOne(() => Chats, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chat_id' })
  chat!: Chats;

  @ManyToOne(() => Users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sender_id' })
  sender!: Users;

  @ManyToOne(() => Messages, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'reply_to_message_id' })
  replyToMessage?: Messages;

  @OneToMany(() => MessageReads, (read) => read.message)
  reads?: MessageReads[];
}
