import { Test, TestingModule } from '@nestjs/testing';
import { ChatMembersRepository } from '@src/features/chats/repository/chat-members.repository';
import { MessageReadsRepository } from '../repository/message-reads.repository';
import { MessagesRepository } from '../repository/messages.repository';
import { IdCryptoService } from '../utils/id-crypto.service';
import { MessagesService } from './messages.service';

describe('MessagesService', () => {
  let service: MessagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        {
          provide: MessagesRepository,
          useValue: {
            createMessage: jest.fn(),
            findMessageById: jest.fn(),
            findMessagesByCursor: jest.fn(),
            updateMessage: jest.fn(),
            softDeleteMessage: jest.fn(),
          },
        },
        {
          provide: MessageReadsRepository,
          useValue: { markAsRead: jest.fn() },
        },
        {
          provide: ChatMembersRepository,
          useValue: { isMember: jest.fn() },
        },
        {
          provide: IdCryptoService,
          useValue: {
            signMessageId: jest.fn(),
            resolveMessageId: jest.fn(),
            createCursor: jest.fn(),
            resolveCursor: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
