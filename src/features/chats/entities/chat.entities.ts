import { Schemas } from '@src/common/database/database.constants';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatMembers } from './chats-members.entites';
import { Users } from '@src/features/auth/entity/users.entity';
import { Messages } from '@src/features/messages/entities/messages.entities';

export enum ChatType {
  GROUP = 'group',
  SINGLE = 'single',
}

@Entity({
  schema: Schemas.MESSAGING,
  name: 'chats',
})
export class Chats {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  name?: string;

  @Column({
    type: 'enum',
    enum: ChatType,
    default: ChatType.SINGLE,
  })
  type!: ChatType;

  @CreateDateColumn()
  createdAt!: Date;

  // @Column('int', { name: 'createdBy', nullable: false })
  // createdBy!: number;

  @ManyToOne(() => Users, {
    nullable: false,
  })
  @JoinColumn({
    name: 'created_by',
  })
  createdByUser!: Users;

  @OneToMany(() => ChatMembers, (member) => member.chat)
  members!: ChatMembers[];

  @OneToMany(() => Messages, (messages) => messages.chat)
  messages?: Messages[];
}
