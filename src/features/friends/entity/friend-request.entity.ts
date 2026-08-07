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

export enum FriendRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

@Entity({ schema: Schemas.MESSAGING, name: 'friend_requests' })
@Unique(['senderId', 'receiverId'])
export class FriendRequests {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'sender_id', type: 'integer', nullable: false })
  senderId!: number;

  @ManyToOne(() => Users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sender_id' })
  sender!: Users;

  @Column({ name: 'receiver_id', type: 'integer', nullable: false })
  receiverId!: number;

  @ManyToOne(() => Users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'receiver_id' })
  receiver!: Users;

  @Column({
    name: 'status',
    type: 'enum',
    enum: FriendRequestStatus,
    default: FriendRequestStatus.PENDING,
  })
  status!: FriendRequestStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
