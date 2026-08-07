import { Schemas } from '@src/common/database/database.constants';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatMembers } from './chats-members.entites';

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

  @OneToMany(() => ChatMembers, (member) => member.chat)
  members!: ChatMembers[];
}
