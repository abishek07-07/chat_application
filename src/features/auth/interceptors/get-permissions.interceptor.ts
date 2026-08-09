import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserRepository } from '../respository/users.repository';
import { Users } from '../entity/users.entity';

@Injectable()
export class PermissionsInterceptor implements NestInterceptor {
  constructor(private readonly usersRepository: UserRepository) {}
  async intercept(context: ExecutionContext, next: CallHandler) {
    // we will find the permissions of the user and attach it to the req.roles
    const request = context.switchToHttp().getRequest();

    const userid = request.user.id as number;

    if (!userid) throw new UnauthorizedException('Login again');

    const permissionsofUser =
      await this.usersRepository.findUserPermissions(userid);

    if (
      (permissionsofUser?.roles.length as number) <= 0 ||
      permissionsofUser == null
    )
      throw new UnauthorizedException('No permissions exists for the user');

    const perm = this.getPermissions(permissionsofUser as Users);

    if (perm == null || perm.length <= 0)
      throw new UnauthorizedException('No permissions exists for the user');

    request.permissions = perm;

    return next.handle().pipe();
  }

  private getPermissions(users: Users): string[] {
    return users.roles.flatMap(({ permissions }) =>
      permissions.map(({ name }) => name),
    );
  }
}
