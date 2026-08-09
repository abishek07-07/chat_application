import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  FriendRequests,
  FriendRequestStatus,
} from '../entity/friend-request.entity';

@Injectable()
export class FriendRequestRepository {
  constructor(
    @InjectRepository(FriendRequests)
    private readonly repo: Repository<FriendRequests>,
  ) {}

  async createRequest(
    senderId: number,
    receiverId: number,
  ): Promise<FriendRequests> {
    const request = this.repo.create({ senderId, receiverId });
    return this.repo.save(request);
  }

  async findPendingBetween(
    firstUserId: number,
    secondUserId: number,
  ): Promise<FriendRequests | null> {
    return this.repo.findOne({
      where: [
        { senderId: firstUserId, receiverId: secondUserId },
        { senderId: secondUserId, receiverId: firstUserId },
      ],
    });
  }

  async findRequestByIdAndReceiver(
    id: number,
    receiverId: number,
  ): Promise<FriendRequests | null> {
    return this.repo.findOne({
      where: { id, receiverId },
    });
  }

  async findPendingRequestsForUser(
    receiverId: number,
  ): Promise<FriendRequests[]> {
    return this.repo.find({
      where: { receiverId, status: FriendRequestStatus.PENDING },
      relations: { sender: true },
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: number, status: FriendRequestStatus): Promise<void> {
    await this.repo.update({ id }, { status });
  }
}
