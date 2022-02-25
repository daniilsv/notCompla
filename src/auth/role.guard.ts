import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User, UserRole } from 'src/models/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    // Logger.log('can activate');
    const optionalAuth = this.reflector.getAllAndOverride<boolean>('optionalAuth', [
      context.getHandler(),
      context.getClass(),
    ]);
    // Logger.log([optionalAuth]);
    if (optionalAuth) return true;
    const role = this.reflector.getAllAndOverride<UserRole>('role', [
      context.getHandler(),
      context.getClass(),
    ]);
    // Logger.log([role]);

    // Logger.log('not optional');
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    // Logger.log(user);
    if (!user || user.isSoftDeleted()) {
      // Logger.log('no user');
      throw new UnauthorizedException('User not found or has been blocked');
    }

    if (!role) return true;
    // Logger.log('no role');
    if (user.isAdmin || role != UserRole.admin) return true;
    throw new ForbiddenException('User doesn\'t have rights to call this method');
  }
}
