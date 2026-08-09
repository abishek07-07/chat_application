import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Permissions } from '../constants/permissions.constants';

export const CheckPermissions = createParamDecorator(
  (permissions: Permissions, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    const userPermissions = request.permissions as string[];
    const isPermissionsIncluded = userPermissions.includes(permissions);

    if (!isPermissionsIncluded)
      throw new UnauthorizedException('Permission do not exist for the user');
  },
);
