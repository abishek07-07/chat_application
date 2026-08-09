import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@src/features/auth/auth.module';
import { FriendRequestController } from './controllers/friend-request.controller';
import { FriendsController } from './controllers/friends.controller';
import { FriendRequests } from './entity/friend-request.entity';
import { Friends } from './entity/Friends.entity';
import { FriendRequestRepository } from './repository/friend-request.repository';
import { FriendsRepository } from './repository/friends.repository';
import { FriendRequestsService } from './services/friend-requests.service';
import { FriendsService } from './services/friends.service';

@Module({
  imports: [TypeOrmModule.forFeature([FriendRequests, Friends]), AuthModule],
  providers: [
    FriendRequestRepository,
    FriendsRepository,
    FriendRequestsService,
    FriendsService,
  ],
  exports: [FriendRequestsService, FriendsService],
  controllers: [FriendRequestController, FriendsController],
})
export class FriendsModule {}
