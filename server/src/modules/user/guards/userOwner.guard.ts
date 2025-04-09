import { ResourceOwnerGuard } from '@/guards/base/resourceOwner.guard';
import { Injectable } from '@nestjs/common';

@Injectable()
export 
class UserOwnerGuard extends ResourceOwnerGuard {
  async checkOwnership(userId: string, resourceId: string): Promise<boolean> {
    return userId === resourceId;
  }
}