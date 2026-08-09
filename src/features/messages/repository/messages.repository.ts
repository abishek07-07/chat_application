import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Messages, MessageType } from '../entities/messages.entities';

@Injectable()
export class MessagesRepository {
  constructor(
    @InjectRepository(Messages)
    private readonly repo: Repository<Messages>,
  ) {}

  async createMessage(data: {
    chatId: number;
    senderId: number;
    type: MessageType;
    message?: string;
    attachmentUrl?: string;
    replyToMessageId?: number;
  }): Promise<Messages> {
    const message = this.repo.create(data);
    return this.repo.save(message);
  }

  async findMessageById(id: number): Promise<Messages | null> {
    return this.repo.findOne({
      where: { id },
      relations: { sender: true, replyToMessage: true, reads: true },
    });
  }

  async findMessagesByCursor(
    chatId: number,
    limit: number,
    cursor?: { sentAt: Date; id: number },
  ): Promise<Messages[]> {
    const query = this.repo
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.replyToMessage', 'replyToMessage')
      .leftJoinAndSelect('message.reads', 'reads')
      .where('message.chatId = :chatId', { chatId })
      .orderBy('message.sentAt', 'DESC')
      .addOrderBy('message.id', 'DESC')
      .take(limit);

    if (cursor) {
      query.andWhere(
        '(message.sentAt < :sentAt OR (message.sentAt = :sentAt AND message.id < :id))',
        { sentAt: cursor.sentAt, id: cursor.id },
      );
    }

    return query.getMany();
  }

  async updateMessage(id: number, data: Partial<Messages>): Promise<void> {
    await this.repo.update({ id }, data);
  }

  async softDeleteMessage(id: number, deletedAt: Date): Promise<void> {
    await this.repo.update({ id }, { isDeleted: true, deletedAt });
  }
}
