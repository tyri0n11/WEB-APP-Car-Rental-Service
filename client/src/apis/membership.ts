import { BaseApi } from './base';
import { Membership, Reward, PointHistory, MembershipLevel } from '../types/membership';
import { handleApiError } from '../utils/error';

interface MembershipBenefits {
  level: MembershipLevel;
  pointsMultiplier: number;
  discountPercentage: number;
  requiredPoints: number;
  perks: string[];
}

export const MEMBERSHIP_LEVELS: { [key in MembershipLevel]: MembershipBenefits } = {
  SILVER: {
    level: MembershipLevel.SILVER,
    pointsMultiplier: 1,
    discountPercentage: 5,
    requiredPoints: 0,
    perks: [
      '5% discount on all rentals',
      'Earn 1 point per 10,000đ spent',
      'Basic customer support',
      'Access to standard vehicles'
    ]
  },
  GOLD: {
    level: MembershipLevel.GOLD,
    pointsMultiplier: 1.5,
    discountPercentage: 10,
    requiredPoints: 1000,
    perks: [
      '10% discount on all rentals',
      'Earn 1.5 points per 10,000đ spent',
      'Priority customer support',
      'Free upgrade when available',
      'Access to premium vehicles'
    ]
  },
  DIAMOND: {
    level: MembershipLevel.DIAMOND,
    pointsMultiplier: 2,
    discountPercentage: 20,
    requiredPoints: 5000,
    perks: [
      '20% discount on all rentals',
      'Earn 2 points per 10,000đ spent',
      'VIP customer support',
      'Guaranteed free upgrade when available',
      'Early access to new vehicles',
      'Exclusive access to luxury vehicles',
      'Free additional driver'
    ]
  }
};

class MembershipApi extends BaseApi {
  async getMembership(): Promise<Membership & MembershipBenefits> {
    try {
      const result = await this.get<{ data: Membership }>('/membership', {});
      
      // If no membership data exists, return default SILVER membership
      if (!result.data || !result.data.level) {
        return {
          id: '',
          userId: '',
          level: MembershipLevel.SILVER,
          points: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          pointsMultiplier: MEMBERSHIP_LEVELS[MembershipLevel.SILVER].pointsMultiplier,
          discountPercentage: MEMBERSHIP_LEVELS[MembershipLevel.SILVER].discountPercentage,
          requiredPoints: MEMBERSHIP_LEVELS[MembershipLevel.SILVER].requiredPoints,
          perks: MEMBERSHIP_LEVELS[MembershipLevel.SILVER].perks
        };
      }
      
      // Ensure we have a valid membership level
      const level = Object.values(MembershipLevel).includes(result.data.level) 
        ? result.data.level 
        : MembershipLevel.SILVER;
      
      const benefits = MEMBERSHIP_LEVELS[level];
      if (!benefits) {
        throw new Error(`Invalid membership level: ${level}`);
      }

      return {
        ...result.data,
        pointsMultiplier: benefits.pointsMultiplier,
        discountPercentage: benefits.discountPercentage,
        requiredPoints: benefits.requiredPoints,
        perks: benefits.perks
      };
    } catch (error) {
      console.error('Error fetching membership:', error);
      throw handleApiError(error);
    }
  }

  async getRewards(): Promise<Reward[]> {
    try {
      const result = await this.get<{ data: Reward[] }>('/membership/rewards', {});
      return result.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getPointsHistory(): Promise<PointHistory[]> {
    try {
      const result = await this.get<{ data: PointHistory[] }>('/membership/points-history', {});
      return result.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async exchangePoints(rewardId: string, points: number): Promise<void> {
    try {
      await this.post('/membership/exchange-points', { rewardId, points });
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export const membershipApi = new MembershipApi();