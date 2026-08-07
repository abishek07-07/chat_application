import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/features/auth/guards/jwt-auth.guard';
import { FriendsService } from '../services/friends.service';
import { FriendListResponse } from '../dto/response/friends-list.response';

interface AuthenticatedRequest {
  user: { id: number; email: string };
}

@ApiTags('Friends')
@Controller('friends')
@UseGuards(JwtAuthGuard)
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all friends of the current user' })
  @ApiOkResponse({
    description: 'Friends fetched successfully.',
    type: FriendListResponse,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  getFriends(@Request() req: AuthenticatedRequest) {
    return this.friendsService.getFriends(req.user.id);
  }

  @Delete(':friendId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove a friend' })
  @ApiOkResponse({ description: 'Friend removed successfully.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  removeFriend(
    @Request() req: AuthenticatedRequest,
    @Param('friendId', ParseIntPipe) friendId: number,
  ) {
    return this.friendsService.removeFriend(req.user.id, friendId);
  }
}
