import { SetMetadata } from '@nestjs/common';
import { TypeUsers } from 'src/constants/roles';

export const META_ROLES = 'roles';

export const RoleProtected = (...args: TypeUsers[]) => {
  return SetMetadata(META_ROLES, args);
};
