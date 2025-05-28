import { RequestWithUser } from '@/types/request.type';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export abstract class ResourceOwnerGuard implements CanActivate {
  protected readonly logger = new Logger(this.constructor.name);
  abstract checkOwnership(
    userId: string,
    resourceId: string,
    request?: Request,
  ): Promise<boolean>;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestWithUser = context.switchToHttp().getRequest();
    const user = request.user;

    // Get the appropriate parameter based on the route path
    const isCodeRoute = request.path.includes('/code/');
    const paramName = isCodeRoute ? 'code' : 'id';
    const resourceId = request.params[paramName];

    this.logger.debug('Route info:', {
      path: request.path,
      isCodeRoute,
      paramName,
      params: request.params,
      resourceId,
    });

    if (!resourceId) {
      this.logger.error(`Missing required parameter: ${paramName}`);
      throw new ForbiddenException('Invalid resource identifier');
    }

    const isOwner = await this.checkOwnership(user.id, resourceId, request);
    if (!isOwner) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}
