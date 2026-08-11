import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ChatMembers } from '../entities/chats-members.entites';

interface users {
  id: number;
  isAdmin: boolean;
  alias?: string;
}

@Injectable()
export class ChatMembersRepository {
  constructor(
    @InjectRepository(ChatMembers)
    private readonly repo: Repository<ChatMembers>,
  ) {}

  async addMember(
    chatId: number,
    userId: number,
    options?: { alias?: string; isAdmin?: boolean },
  ): Promise<ChatMembers> {
    const member = this.repo.create({
      chatId,
      userId,
      alias: options?.alias,
      isAdmin: options?.isAdmin ?? false,
    });
    return this.repo.save(member);
  }

  async createFirstChat(chatId: number, users: users[]): Promise<void> {
    const members = users.map((userId) =>
      this.repo.create({ chatId, ...userId }),
    );
    await this.repo.save(members);
  }

  async addMembers(chatId: number, users: number[]) {
    const temp = users.map((usr) => {
      return this.repo.create({ chatId, userId: usr, isAdmin: false });
    });
    await this.repo.save(temp);
  }

  async findMember(
    chatId: number,
    userId: number,
  ): Promise<ChatMembers | null> {
    return this.repo.findOne({ where: { chatId, userId } });
  }

  async findMembersForChat(chatId: number): Promise<ChatMembers[]> {
    return this.repo.find({
      where: { chatId },
      relations: { user: true },
      order: { joinedAt: 'ASC' },
    });
  }

  async findExistingMembers(
    chatId: number,
    userIds: number[],
  ): Promise<ChatMembers[]> {
    return this.repo.find({
      where: { chatId, userId: In(userIds) },
    });
  }

  async isMember(chatId: number, userId: number): Promise<boolean> {
    const count = await this.repo.count({ where: { chatId, userId } });
    return count > 0;
  }

  async removeMember(chatId: number, userId: number): Promise<void> {
    await this.repo.delete({ chatId, userId });
  }

  async removeMembers(chatId: number, userIds: number[]): Promise<void> {
    await this.repo.delete({ chatId, userId: In(userIds) });
  }

  async countMembers(chatId: number): Promise<number> {
    return this.repo.count({ where: { chatId } });
  }
}
