import { Injectable } from '@nestjs/common';
import { ResourceOwnerGuard } from '@/guards/base/resourceOwner.guard';
import { ReviewService } from '../review.service';

@Injectable()
export class ReviewOwnerGuard extends ResourceOwnerGuard {
  constructor(private readonly reviewService: ReviewService) {
    super();
  }
  async checkOwnership(userId: string, resourceId: string): Promise<boolean> {
    const review = await this.reviewService.findOne({ id: resourceId });
    return review.userId === userId;
  }
}
