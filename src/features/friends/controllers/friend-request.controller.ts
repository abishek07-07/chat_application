import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/features/auth/guards/jwt-auth.guard';
import { FriendRequestsService } from '../services/friend-requests.service';
import { SendFriendRequest } from '../dto/request/send-friendrequest.request';
import { AcceptFriendRequest } from '../dto/request/accept-friend-request.request';
import { PendingFriendRequestResponse } from '../dto/response/pending-friend-request.response';

interface AuthenticatedRequest {
  user: { id: number; email: string },
  roles : string[]
}

@ApiTags('Friend Requests')
@Controller('friend-requests')
@UseGuards(JwtAuthGuard)
export class FriendRequestController {
  constructor(private readonly friendRequestsService: FriendRequestsService) {}

  @Post('send')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Send a friend request to another user' })
  @ApiBody({ type: SendFriendRequest })
  @ApiCreatedResponse({ description: 'Friend request sent successfully.' })
  @ApiBadRequestResponse({
    description: 'Invalid payload or a request already exists.',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  sendFriendRequest(
    @Request() req: AuthenticatedRequest,
    @Body() request: SendFriendRequest,
  ) {
    return this.friendRequestsService.sendFriendRequest(req.user.id, request);
  }

  @Get('pending')
  @ApiOperation({
    summary: 'Get all pending friend requests for the current user',
  })
  @ApiOkResponse({
    description: 'Pending friend requests fetched successfully.',
    type: PendingFriendRequestResponse,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  getPendingRequests(@Request() req: AuthenticatedRequest) {
    return this.friendRequestsService.getPendingRequests(req.user.id);
  }

  @Post('accept')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Accept a pending friend request' })
  @ApiBody({ type: AcceptFriendRequest })
  @ApiOkResponse({ description: 'Friend request accepted.' })
  @ApiBadRequestResponse({ description: 'Request is no longer pending.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  acceptFriendRequest(
    @Request() req: AuthenticatedRequest,
    @Body() request: AcceptFriendRequest,
  ) {
    return this.friendRequestsService.acceptFriendRequest(req.user.id, request);
  }

  @Post('reject')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reject a pending friend request' })
  @ApiBody({ type: AcceptFriendRequest })
  @ApiOkResponse({ description: 'Friend request rejected.' })
  @ApiBadRequestResponse({ description: 'Request is no longer pending.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  rejectFriendRequest(
    @Request() req: AuthenticatedRequest,
    @Body() request: AcceptFriendRequest,
  ) {
    return this.friendRequestsService.rejectFriendRequest(req.user.id, request);
  }
}
