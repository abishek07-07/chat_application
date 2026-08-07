import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friends } from '../entity/Friends.entity';

@Injectable()
export class FriendsRepository {
  constructor(
    @InjectRepository(Friends)
    private readonly repo: Repository<Friends>,
  ) {}

  async areFriends(userId: number, friendId: number): Promise<boolean> {
    const count = await this.repo.count({
      where: [
        { userId, friendId },
        { userId: friendId, friendId: userId },
      ],
    });
    return count > 0;
  }

  async createFriendship(userId: number, friendId: number): Promise<void> {
    const userSide = this.repo.create({ userId, friendId });
    const friendSide = this.repo.create({ userId: friendId, friendId: userId });
    await this.repo.save([userSide, friendSide]);
  }

  async findFriendsForUser(userId: number): Promise<Friends[]> {
    return this.repo.find({
      where: { userId },
      relations: { friend: true },
      order: { createdAt: 'DESC' },
    });
  }

  async removeFriendship(userId: number, friendId: number): Promise<void> {
    await this.repo.delete({ userId, friendId });
    await this.repo.delete({ userId: friendId, friendId: userId });
  }
}
