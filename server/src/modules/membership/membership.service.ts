import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MembershipLevel } from '@prisma/client';
import { MEMBERSHIP_LEVELS } from './constants/membership.const';

@Injectable()
export class MembershipService {
  constructor(private prisma: PrismaService) {}
  async getMembership(userId: string) {
    const membership = await this.prisma.membership.findUnique({
      where: { userId },
    });

    if (!membership) {
      // Create default silver membership for new users
      const newMembership = await this.prisma.membership.create({
        data: {
          userId,
          level: MembershipLevel.SILVER,
          points: 0,
        },
      });
      return {
        ...newMembership,
        ...MEMBERSHIP_LEVELS[newMembership.level]
      };
    }

    return {
      ...membership,
      ...MEMBERSHIP_LEVELS[membership.level]
    };
  }

  async getRewards(userId: string) {
    return this.prisma.reward.findMany({
      where: {
        OR: [
          { userId },
          { isPublic: true },
        ],
      },
    });
  }

  async getPointsHistory(userId: string) {
    return this.prisma.pointHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async exchangePoints(userId: string, rewardId: string, points: number) {
    // Start a transaction to ensure atomicity
    return this.prisma.$transaction(async (tx) => {
      const membership = await tx.membership.findUnique({
        where: { userId },
      });

      if (!membership || membership.points < points) {
        throw new Error('Insufficient points');
      }

      // Update membership points
      await tx.membership.update({
        where: { userId },
        data: { points: { decrement: points } },
      });

      // Create points history record
      await tx.pointHistory.create({
        data: {
          userId,
          points: -points,
          description: 'Points exchanged for reward',
          rewardId,
        },
      });

      // Mark reward as used
      await tx.reward.update({
        where: { id: rewardId },
        data: { isUsed: true },
      });
    });
  }
}
