import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entity/users.entity';
import { Roles } from '../entity/roles.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(Users)
    private readonly repo: Repository<Users>,
  ) {}

  async saveUser(
    request: Pick<Users, 'email' | 'password' | 'firstName' | 'lastName'>,
    roles: Roles,
  ): Promise<void> {
    const user = this.repo.create({
      ...request,
      roles: [roles],
    });

    await this.repo.save(user);
  }

  async findUserByEmail(email: string): Promise<Users | null> {
    return await this.repo.findOne({
      where: {
        email: email,
      },
    });
  }

  async findUserById(id: number): Promise<Users | null> {
    return await this.repo.findOne({
      where: {
        id,
      },
    });
  }

  async findUserByIdentifier(identifier: string) {
    return await this.repo.findOne({
      where: {
        identifier,
      },
    });
  }

  async findUserPermissions(id: number) {
    return await this.repo.findOne({
      where: {
        id,
      },
      relationLoadStrategy: 'join',
      cache: true,
      loadRelationIds: true,
      select: {
        roles: {
          permissions: {
            name: true,
          },
        },
      },
    });
  }
}
