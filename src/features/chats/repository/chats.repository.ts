import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chats, ChatType } from '../entities/chat.entities';

@Injectable()
export class ChatsRepository {
  constructor(
    @InjectRepository(Chats)
    private readonly repo: Repository<Chats>,
  ) {}

  async createChat(data: { type: ChatType; name?: string }): Promise<Chats> {
    const chat = this.repo.create(data);
    return this.repo.save(chat);
  }

  async findChatById(id: number): Promise<Chats | null> {
    return this.repo.findOne({
      where: { id },
      relations: { members: { user: true } },
    });
  }

  async findChatsForUser(userId: number): Promise<Chats[]> {
    return this.repo.find({
      where: { members: { userId } },
      relations: { members: { user: true } },
      order: { createdAt: 'DESC' },
    });
  }

  async findSingleChatBetweenUsers(
    firstUserId: number,
    secondUserId: number,
  ): Promise<Chats | null> {
    return this.repo
      .createQueryBuilder('chat')
      .innerJoin('chat.members', 'member')
      .where('chat.type = :type', { type: ChatType.SINGLE })
      .andWhere('member.userId IN (:...userIds)', {
        userIds: [firstUserId, secondUserId],
      })
      .groupBy('chat.id')
      .having('COUNT(DISTINCT member.userId) = 2')
      .getOne();
  }

  async updateChatName(id: number, name: string): Promise<void> {
    await this.repo.update({ id }, { name });
  }

  async deleteChat(id: number): Promise<void> {
    await this.repo.delete({ id });
  }
}
