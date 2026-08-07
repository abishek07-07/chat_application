import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/features/auth/guards/jwt-auth.guard';
import { CreateChatRequest } from '../dto/request/create-chat.request';
import { UpdateChatRequest } from '../dto/request/update-chat.request';
import { ChatResponse } from '../dto/responses/chat.response';
import { ChatsService } from '../services/chats.services';

interface AuthenticatedRequest {
  user: { id: number; email: string };
}

@ApiTags('Chats')
@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a single or group chat' })
  @ApiBody({ type: CreateChatRequest })
  @ApiCreatedResponse({
    description: 'Chat created successfully.',
    type: ChatResponse,
  })
  @ApiBadRequestResponse({ description: 'Invalid payload or chat exists.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  createChat(
    @Request() req: AuthenticatedRequest,
    @Body() request: CreateChatRequest,
  ) {
    return this.chatsService.createChat(req.user.id, request);
  }

  @Get()
  @ApiOperation({ summary: 'Get all chats of the current user' })
  @ApiOkResponse({
    description: 'Chats fetched successfully.',
    type: ChatResponse,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  getUserChats(@Request() req: AuthenticatedRequest) {
    return this.chatsService.getUserChats(req.user.id);
  }

  @Get(':chatId')
  @ApiOperation({ summary: 'Get a chat by id' })
  @ApiOkResponse({
    description: 'Chat fetched successfully.',
    type: ChatResponse,
  })
  @ApiNotFoundResponse({ description: 'Chat not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  getChatById(
    @Request() req: AuthenticatedRequest,
    @Param('chatId', ParseIntPipe) chatId: number,
  ) {
    return this.chatsService.getChatById(req.user.id, chatId);
  }

  @Patch(':chatId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rename a group chat' })
  @ApiBody({ type: UpdateChatRequest })
  @ApiOkResponse({
    description: 'Chat updated successfully.',
    type: ChatResponse,
  })
  @ApiForbiddenResponse({
    description: 'Only group admins can rename the chat.',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  updateChat(
    @Request() req: AuthenticatedRequest,
    @Param('chatId', ParseIntPipe) chatId: number,
    @Body() request: UpdateChatRequest,
  ) {
    return this.chatsService.updateChat(req.user.id, chatId, request);
  }

  @Delete(':chatId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Leave a chat' })
  @ApiOkResponse({ description: 'Left the chat successfully.' })
  @ApiNotFoundResponse({ description: 'Chat not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  leaveChat(
    @Request() req: AuthenticatedRequest,
    @Param('chatId', ParseIntPipe) chatId: number,
  ) {
    return this.chatsService.leaveChat(req.user.id, chatId);
  }
}
