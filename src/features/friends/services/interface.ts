import { IResult } from '@src/utils/responses/SuccessfulResponse';
import { AcceptFriendRequest } from '../dto/request/accept-friend-request.request';
import { SendFriendRequest } from '../dto/request/send-friendrequest.request';
import { FriendListResponse } from '../dto/response/friends-list.response';
import { PendingFriendRequestResponse } from '../dto/response/pending-friend-request.response';

export interface IFriendRequestsService {
  sendFriendRequest(
    senderId: number,
    request: SendFriendRequest,
  ): Promise<IResult<null>>;
  getPendingRequests(
    receiverId: number,
  ): Promise<IResult<PendingFriendRequestResponse[]>>;
  acceptFriendRequest(
    receiverId: number,
    request: AcceptFriendRequest,
  ): Promise<IResult<null>>;
  rejectFriendRequest(
    receiverId: number,
    request: AcceptFriendRequest,
  ): Promise<IResult<null>>;
}

export interface IFriendsService {
  getFriends(userId: number): Promise<IResult<FriendListResponse[]>>;
  removeFriend(userId: number, friendId: number): Promise<IResult<null>>;
}
