import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PaymentGatewayFactory } from './gateways/gateway.factory';
import {
  CallbackData,
  CreatePaymentLinkOptions,
} from './interfaces/paymentGateway.interface';
import { TransactionQueue } from './enums/queue';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { MembershipService } from '@/modules/membership/membership.service';
import { GatewayName } from './enums/gatewayName';
import { PaymentCallbackResponseDTO } from './dtos/callback.response.dto';
import { MembershipLevel } from '@prisma/client';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentGatewayFactory: PaymentGatewayFactory,
    @InjectQueue(TransactionQueue.name)
    private readonly transactionQueue: Queue,
    private readonly prisma: PrismaService,
    private readonly membershipService: MembershipService,
  ) {}

  private readonly JOB_NAME_PREFIX = 'transaction';
  private readonly PROCESS_JOB_NAME = this.JOB_NAME_PREFIX + ':process';

  private async handleSucessPayment(bookingCode: string, amount: number): Promise<{ earnedPoints: number; membershipLevel: MembershipLevel; membershipMultiplier: number }> {
    try {
      console.log('Starting handleSuccessPayment:', { bookingCode, amount });
      
      // Find the booking and user
      const booking = await this.prisma.booking.findUnique({
        where: { code: bookingCode },
        include: { user: true }
      });
      
      console.log('Found booking:', booking);
      
      if (!booking || !booking.userId) {
        throw new Error('Booking or user not found');
      }

      // Get user's membership
      const membership = await this.membershipService.getMembership(booking.userId);
      console.log('Current membership:', membership);
      
      // Calculate points based on membership level multiplier (1 point per 10,000đ spent)
      const basePoints = Math.floor(amount / 10000);
      const earnedPoints = Math.floor(basePoints * membership.pointsMultiplier);
      
      console.log('Points calculation:', {
        amount,
        basePoints,
        multiplier: membership.pointsMultiplier,
        earnedPoints
      });

      // Update membership points and create history record in a transaction
      const result = await this.prisma.$transaction([
        // Update user's membership points
        this.prisma.membership.update({
          where: { userId: booking.userId },
          data: { points: { increment: earnedPoints } }
        }),
        // Create points history record
        this.prisma.pointHistory.create({
          data: {
            userId: booking.userId,
            points: earnedPoints,
            description: `Earned ${earnedPoints} points from booking ${bookingCode} (${membership.level} member)`
          }
        })
      ]);
      
      console.log('Transaction result:', result);

      return {
        earnedPoints,
        membershipLevel: membership.level,
        membershipMultiplier: membership.pointsMultiplier
      };
    } catch (error) {
      console.error('Error in handleSuccessPayment:', error);
      throw error;
    }
  }

  // Transaction Queue
  async addTransactionToQueue(bookingCode: string): Promise<void> {
    await this.transactionQueue.add(this.PROCESS_JOB_NAME, {
      bookingCode,
    });
  }

  async createPaymentLink(gatewayType: string, dto: CreatePaymentLinkOptions) {
    const gateway = this.paymentGatewayFactory.getGateway(gatewayType);
    const url = await gateway.createPaymentLink(dto);
    return { url };
  }

  async handleCallback(
    gateway: GatewayName,
    params: { data: any; host: string }
  ): Promise<PaymentCallbackResponseDTO> {
    try {
      const { data } = params;
      console.log('Payment callback received:', data);
      
      // Process the payment callback data
      const bookingCode = data.apptransid; // ZaloPay transaction ID
      const success = data.status === '1'; // ZaloPay uses '1' for success

      if (success && bookingCode) {
        try {
          // Get booking amount from the database
          const booking = await this.prisma.booking.findUnique({
            where: { code: bookingCode },
            select: { totalPrice: true }
          });

          console.log('Found booking for points:', booking);

          if (!booking) {
            throw new Error(`Booking not found: ${bookingCode}`);
          }

          // Process points using the actual booking amount
          const { earnedPoints, membershipLevel, membershipMultiplier } = 
            await this.handleSucessPayment(bookingCode, booking.totalPrice);

          console.log('Points processed successfully:', {
            bookingCode,
            amount: booking.totalPrice,
            earnedPoints,
            membershipLevel
          });

          // Return success with points and membership data
          return {
            success: true,
            bookingCode,
            response: {
              return_code: 1,
              return_message: 'Payment successful'
            },
            pointsEarned: earnedPoints,
            membershipLevel
          };
        } catch (pointsError) {
          console.error('Error processing points:', pointsError);
          // Continue with success response even if points processing fails
          return {
            success: true,
            bookingCode,
            response: {
              return_code: 1,
              return_message: 'Payment successful but failed to process points'
            }
          };
        }
      }

      console.log('Payment not successful or no booking code');
      return {
        success: false,
        bookingCode,
        response: {
          return_code: 0,
          return_message: 'Payment failed'
        }
      };
    } catch (error) {
      console.error('Error in payment callback:', error);
      return {
        success: false,
        response: {
          return_code: -1,
          return_message: 'Payment processing failed'
        }
      };
    }
  }
}
