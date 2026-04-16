import { SetMetadata } from '@nestjs/common';
import type { UserRole } from '@org/types';

export const rolesMetadataKey = 'ripples:roles';

export function Roles(...roles: UserRole[]): ReturnType<typeof SetMetadata> {
  return SetMetadata(rolesMetadataKey, roles);
}
