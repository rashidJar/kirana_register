import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/use-cases/user/types/users.enum';
import { ROLES_KEY } from 'src/auth/decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const storeId = request.body.storeId;
    const userRolesForStore = user.roles[storeId];
    if (!user || !storeId || !userRolesForStore) {
      return false;
    }
    return requiredRoles.some((role) => userRolesForStore.includes(role));
  }
}
