import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/features/auth/guards/jwt-auth.guard';
import { AddChatMembersRequest } from '../dto/request/add-chat-members.request';
import { RemoveChatMembersRequest } from '../dto/request/remove-chat-members.request';
import { ChatMemberResponse } from '../dto/responses/chat-member.response';
import { ChatMembersService } from '../services/chats-members.services';

interface AuthenticatedRequest {
  user: { id: number; email: string };
}

@ApiTags('Chat Members')
@Controller('chats/:chatId/members')
@UseGuards(JwtAuthGuard)
export class ChatMemberController {
  constructor(private readonly chatMembersService: ChatMembersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all members of a chat' })
  @ApiOkResponse({
    description: 'Chat members fetched successfully.',
    type: ChatMemberResponse,
    isArray: true,
  })
  @ApiNotFoundResponse({ description: 'Chat not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  getChatMembers(
    @Request() req: AuthenticatedRequest,
    @Param('chatId', ParseIntPipe) chatId: number,
  ) {
    return this.chatMembersService.getChatMembers(req.user.id, chatId);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add members to a group chat' })
  @ApiBody({ type: AddChatMembersRequest })
  @ApiOkResponse({ description: 'Members added successfully.' })
  @ApiForbiddenResponse({
    description: 'Only group admins can manage members.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid payload or all users are already members.',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  addMembers(
    @Request() req: AuthenticatedRequest,
    @Param('chatId', ParseIntPipe) chatId: number,
    @Body() request: AddChatMembersRequest,
  ) {
    return this.chatMembersService.addMembers(req.user.id, chatId, request);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove members from a group chat' })
  @ApiBody({ type: RemoveChatMembersRequest })
  @ApiOkResponse({ description: 'Members removed successfully.' })
  @ApiForbiddenResponse({
    description: 'Only group admins can manage members.',
  })
  @ApiBadRequestResponse({ description: 'Invalid payload.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  removeMembers(
    @Request() req: AuthenticatedRequest,
    @Param('chatId', ParseIntPipe) chatId: number,
    @Body() request: RemoveChatMembersRequest,
  ) {
    return this.chatMembersService.removeMembers(req.user.id, chatId, request);
  }
}
