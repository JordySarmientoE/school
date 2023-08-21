import { applyDecorators, UseGuards } from '@nestjs/common';
import { TypeUsers } from 'src/constants/roles';
import { RoleProtected } from './role-protected.decorator';
import { UserRoleGuard } from '../guards/user-role.guard';
import { AuthGuard } from '@nestjs/passport';

export function Auth(...roles: TypeUsers[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
}
