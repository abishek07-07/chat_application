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
  Query,
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
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/features/auth/guards/jwt-auth.guard';
import { CreateMessageRequest } from '../dto/request/create-message.request';
import { UpdateMessageRequest } from '../dto/request/update-message.request';
import {
  MessageResponse,
  PaginatedMessageResponse,
} from '../dto/responses/message.response';
import { MessagesService } from '../services/messages.service';

interface AuthenticatedRequest {
  user: { id: number; email: string };
}

@ApiTags('Messages')
@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Send a message to a chat' })
  @ApiBody({ type: CreateMessageRequest })
  @ApiCreatedResponse({
    description: 'Message sent successfully.',
    type: MessageResponse,
  })
  @ApiBadRequestResponse({ description: 'Invalid payload.' })
  @ApiNotFoundResponse({ description: 'Chat not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  sendMessage(
    @Request() req: AuthenticatedRequest,
    @Body() request: CreateMessageRequest,
  ) {
    return this.messagesService.sendMessage(req.user.id, request);
  }

  @Get()
  @ApiOperation({ summary: 'Get messages of a chat (cursor paginated)' })
  @ApiQuery({ name: 'chatId', type: Number, required: true })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({
    name: 'cursor',
    type: String,
    required: false,
    description: 'Opaque cursor from the previous page',
  })
  @ApiOkResponse({
    description: 'Messages fetched successfully.',
    type: PaginatedMessageResponse,
  })
  @ApiNotFoundResponse({ description: 'Chat not found.' })
  @ApiBadRequestResponse({ description: 'Invalid cursor.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  getMessages(
    @Request() req: AuthenticatedRequest,
    @Query('chatId', ParseIntPipe) chatId: number,
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
  ) {
    return this.messagesService.getMessages(
      req.user.id,
      chatId,
      limit ? Number(limit) : undefined,
      cursor,
    );
  }

  @Get(':messageKey')
  @ApiOperation({ summary: 'Get a single message by its key' })
  @ApiParam({
    name: 'messageKey',
    description: 'Opaque cryptographic key of the message',
  })
  @ApiOkResponse({
    description: 'Message fetched successfully.',
    type: MessageResponse,
  })
  @ApiNotFoundResponse({ description: 'Message not found.' })
  @ApiBadRequestResponse({ description: 'Invalid message key.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  getMessageById(
    @Request() req: AuthenticatedRequest,
    @Param('messageKey') messageKey: string,
  ) {
    return this.messagesService.getMessageById(req.user.id, messageKey);
  }

  @Patch(':messageKey')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Edit an own text message' })
  @ApiParam({
    name: 'messageKey',
    description: 'Opaque cryptographic key of the message',
  })
  @ApiBody({ type: UpdateMessageRequest })
  @ApiOkResponse({
    description: 'Message updated successfully.',
    type: MessageResponse,
  })
  @ApiForbiddenResponse({
    description: 'Only the sender can edit their messages.',
  })
  @ApiBadRequestResponse({ description: 'Only text messages can be edited.' })
  @ApiNotFoundResponse({ description: 'Message not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  editMessage(
    @Request() req: AuthenticatedRequest,
    @Param('messageKey') messageKey: string,
    @Body() request: UpdateMessageRequest,
  ) {
    return this.messagesService.editMessage(req.user.id, messageKey, request);
  }

  @Delete(':messageKey')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete an own message' })
  @ApiParam({
    name: 'messageKey',
    description: 'Opaque cryptographic key of the message',
  })
  @ApiOkResponse({ description: 'Message deleted successfully.' })
  @ApiForbiddenResponse({
    description: 'Only the sender can delete their messages.',
  })
  @ApiNotFoundResponse({ description: 'Message not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  deleteMessage(
    @Request() req: AuthenticatedRequest,
    @Param('messageKey') messageKey: string,
  ) {
    return this.messagesService.deleteMessage(req.user.id, messageKey);
  }

  @Post(':messageKey/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark a message as read' })
  @ApiParam({
    name: 'messageKey',
    description: 'Opaque cryptographic key of the message',
  })
  @ApiOkResponse({ description: 'Message marked as read.' })
  @ApiBadRequestResponse({
    description: 'Cannot mark your own message as read.',
  })
  @ApiNotFoundResponse({ description: 'Message not found.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  markAsRead(
    @Request() req: AuthenticatedRequest,
    @Param('messageKey') messageKey: string,
  ) {
    return this.messagesService.markAsRead(req.user.id, messageKey);
  }
}
