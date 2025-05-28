import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { User } from '../../decorators/user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAccessGuard } from '../auth/guards/jwt/jwtAccess.guard';

@ApiTags('Membership')
@ApiBearerAuth()
@Controller('membership')
@UseGuards(JwtAccessGuard)
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @ApiOperation({ summary: 'Get user membership details' })
  @ApiResponse({ status: 200, description: 'Returns the user membership information' })
  @Get()
  async getMembership(@User('id') userId: string) {
    const membership = await this.membershipService.getMembership(userId);
    return { data: membership };
  }

  @ApiOperation({ summary: 'Get available rewards' })
  @ApiResponse({ status: 200, description: 'Returns the list of available rewards' })
  @Get('rewards')
  async getRewards(@User('id') userId: string) {
    const rewards = await this.membershipService.getRewards(userId);
    return { data: rewards };
  }

  @ApiOperation({ summary: 'Get points history' })
  @ApiResponse({ status: 200, description: 'Returns the points history' })
  @Get('points-history')
  async getPointsHistory(@User('id') userId: string) {
    const history = await this.membershipService.getPointsHistory(userId);
    return { data: history };
  }

  @ApiOperation({ summary: 'Exchange points for rewards' })
  @ApiResponse({ status: 200, description: 'Points exchanged successfully' })
  @ApiResponse({ status: 400, description: 'Invalid points or reward' })
  @Post('exchange-points')
  async exchangePoints(
    @User('id') userId: string,
    @Body() body: { rewardId: string; points: number },
  ) {
    await this.membershipService.exchangePoints(userId, body.rewardId, body.points);
    return { message: 'Points exchanged successfully' };
  }
}
