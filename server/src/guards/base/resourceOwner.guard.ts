import { RequestWithUser } from '@/types/request.type';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

@Injectable()
export abstract class ResourceOwnerGuard implements CanActivate {
  constructor(protected readonly reflector: Reflector) {}

  abstract checkOwnership(userId: string, resourceId: string): Promise<boolean>;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestWithUser = context.switchToHttp().getRequest();
    const user = request.user;
    const resourceId = request.params.id;

    // Admin bypass
    if (user.role === Role.ADMIN) {
      return true;
    }

    const isOwner = await this.checkOwnership(user.id, resourceId);
    if (!isOwner) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}
