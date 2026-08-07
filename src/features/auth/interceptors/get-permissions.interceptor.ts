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

    if (permissionsofUser?.roles == null)
      throw new UnauthorizedException('No permissions exists for the user');

    request.permissions = permissionsofUser.roles;

    return next.handle().pipe();
  }
}
