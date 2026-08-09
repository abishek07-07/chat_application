import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageReads } from '../entities/messages-reads.entities';

@Injectable()
export class MessageReadsRepository {
  constructor(
    @InjectRepository(MessageReads)
    private readonly repo: Repository<MessageReads>,
  ) {}

  async markAsRead(messageId: number, userId: number): Promise<void> {
    const exists = await this.repo.findOne({ where: { messageId, userId } });
    if (exists) return;

    const read = this.repo.create({ messageId, userId });
    await this.repo.save(read);
  }
}
