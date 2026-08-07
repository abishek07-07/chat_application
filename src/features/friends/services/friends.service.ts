import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Results } from '@src/utils/responses/SuccessfulResponse';
import { FriendListResponse } from '../dto/response/friends-list.response';
import { FriendsRepository } from '../repository/friends.repository';
import { IFriendsService } from './interface';

@Injectable()
export class FriendsService implements IFriendsService {
  constructor(private readonly friendsRepository: FriendsRepository) {}

  async getFriends(userId: number) {
    const friends = await this.friendsRepository.findFriendsForUser(userId);

    const data = plainToInstance(FriendListResponse, friends, {
      excludeExtraneousValues: true,
    });

    return Results('Friends fetched successfully', data);
  }

  async removeFriend(userId: number, friendId: number) {
    const areFriends = await this.friendsRepository.areFriends(
      userId,
      friendId,
    );
    if (!areFriends) throw new NotFoundException('Friendship does not exist');

    await this.friendsRepository.removeFriendship(userId, friendId);

    return Results('Friend removed successfully', null);
  }
}
