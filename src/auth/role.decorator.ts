import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UserRole } from 'src/models/user.entity';
import { RolesGuard } from './role.guard';

export function Auth(role?: UserRole) {
  return applyDecorators(
    SetMetadata('role', role),
    UseGuards(AuthGuard('jwt')),
    UseGuards(RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'User not found, has been blocked or doesn\'t have rights to call this method' }),
  );
}
export function OptionalAuth() {
  return applyDecorators(
    SetMetadata('optionalAuth', true),
    UseGuards(AuthGuard(['jwt', 'optional']), RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'User not found, has been blocked or doesn\'t have rights to call this method' }),
  );
}
