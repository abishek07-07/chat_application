import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserRepository } from '@src/features/auth/respository/users.repository';
import { Results } from '@src/utils/responses/SuccessfulResponse';
import { SendFriendRequest } from '../dto/request/send-friendrequest.request';
import { AcceptFriendRequest } from '../dto/request/accept-friend-request.request';
import { PendingFriendRequestResponse } from '../dto/response/pending-friend-request.response';
import { FriendRequestRepository } from '../repository/friend-request.repository';
import { FriendsRepository } from '../repository/friends.repository';
import { FriendRequestStatus } from '../entity/friend-request.entity';
import { IFriendRequestsService } from './interface';
import { ChatsRepository } from '@src/features/chats/repository/chats.repository';
import { ChatMembersRepository } from '@src/features/chats/repository/chat-members.repository';
import { Chats, ChatType } from '@src/features/chats/entities/chat.entities';

@Injectable()
export class FriendRequestsService implements IFriendRequestsService {
  constructor(
    private readonly friendRequestRepository: FriendRequestRepository,
    private readonly friendsRepository: FriendsRepository,
    private readonly userRepository: UserRepository,
    private readonly chatRepository: ChatsRepository,
    private readonly chatMembersRepository: ChatMembersRepository,
  ) {}

  async sendFriendRequest(senderId: number, request: SendFriendRequest) {
    console.log(`The send friend request controller is running`);
    const receiver = await this.userRepository.findUserByIdentifier(
      request.receiverIdentifier,
    );
    if (!receiver) throw new NotFoundException('User not found');

    if (receiver.id === senderId)
      throw new BadRequestException(
        'You cannot send a friend request to yourself',
      );

    const alreadyFriends = await this.friendsRepository.areFriends(
      senderId,
      receiver.id,
    );
    if (alreadyFriends)
      throw new BadRequestException('You are already friends with this user');

    const existingRequest =
      await this.friendRequestRepository.findPendingBetween(
        senderId,
        receiver.id,
      );
    if (existingRequest) {
      throw new BadRequestException(
        'A friend request already exists between you and this user',
      );
    }

    await this.friendRequestRepository.createRequest(senderId, receiver.id);

    return Results('Friend request sent successfully', null);
  }

  async getPendingRequests(receiverId: number) {
    const requests =
      await this.friendRequestRepository.findPendingRequestsForUser(receiverId);

    const data = plainToInstance(PendingFriendRequestResponse, requests, {
      excludeExtraneousValues: true,
    });

    return Results('Pending friend requests fetched successfully', data);
  }

  async acceptFriendRequest(receiverId: number, request: AcceptFriendRequest) {
    const friendRequest =
      await this.friendRequestRepository.findRequestByIdAndReceiver(
        request.requestId,
        receiverId,
      );
    if (!friendRequest) throw new NotFoundException('Friend request not found');
    if (friendRequest.status !== FriendRequestStatus.PENDING)
      throw new BadRequestException('Friend request is no longer pending');

    await this.friendRequestRepository.updateStatus(
      friendRequest.id,
      FriendRequestStatus.ACCEPTED,
    );
    await this.friendsRepository.createFriendship(
      friendRequest.senderId,
      friendRequest.receiverId,
    );

    // after the friendship is created we have to create the chats and the chat_members of it
    let chats: Chats;
    try {
      chats = await this.chatRepository.createChat({
        type: ChatType.SINGLE,
        createdBy: receiverId,
      });
    } catch (error) {
      console.log('Error in creating the chats', error);
      throw error;
    }
    if (chats.id == null) throw new Error('The chat id do not exists');
    await this.chatMembersRepository.createFirstChat(chats.id, [
      {
        id: friendRequest.senderId,
        isAdmin: true,
      },
      {
        id: friendRequest.receiverId,
        isAdmin: true,
      },
    ]);
    return Results('Friend request accepted', null);
  }

  async rejectFriendRequest(receiverId: number, request: AcceptFriendRequest) {
    const friendRequest =
      await this.friendRequestRepository.findRequestByIdAndReceiver(
        request.requestId,
        receiverId,
      );
    if (!friendRequest) throw new NotFoundException('Friend request not found');
    if (friendRequest.status !== FriendRequestStatus.PENDING)
      throw new BadRequestException('Friend request is no longer pending');

    await this.friendRequestRepository.updateStatus(
      friendRequest.id,
      FriendRequestStatus.REJECTED,
    );

    return Results('Friend request rejected', null);
  }
}
