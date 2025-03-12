import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from '../auth/guards/jwt/jwtAccess.guard';
import { RecommendationService } from './recommendation.service';
import { RequestWithUser } from '@/types/request.type';

@Controller('recommendation')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Get()
  @UseGuards(JwtAccessGuard)
  getRecommendations(
    @Req() req: RequestWithUser,
    @Query('limit') limit: number = 5,
  ) {
    const userId = req.user.id;
    return this.recommendationService.getRecommendedCars(userId, limit);
  }
}
