import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/use-cases/user/types/users.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
