import { RequestWithUser } from '@/types/request.type';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Role } from '@prisma/client';

@Injectable()
export abstract class ResourceOwnerGuard implements CanActivate {
  abstract checkOwnership(userId: string, resourceId: string): Promise<boolean>;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestWithUser = context.switchToHttp().getRequest();
    const user = request.user;
    const resourceId = request.params.id;

    const isOwner = await this.checkOwnership(user.id, resourceId);
    if (!isOwner) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}
