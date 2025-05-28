import { MembershipLevel } from '@prisma/client';

export interface MembershipBenefits {
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
