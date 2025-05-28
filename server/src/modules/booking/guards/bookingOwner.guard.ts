import { Injectable, BadRequestException, UnauthorizedException, NotFoundException, InternalServerErrorException, HttpException } from '@nestjs/common';
import { Request } from 'express';
import { ResourceOwnerGuard } from '@/guards/base/resourceOwner.guard';
import { BookingService } from '../booking.service';

@Injectable()
export class BookingOwnerGuard extends ResourceOwnerGuard {  constructor(private readonly bookingService: BookingService) {
    super();
  }

  private static isRouteWithCode(request: Request): boolean {
    if (!request?.path) {
      return false;
    }
    return request.path.toLowerCase().includes('/bookings/code/');
  }

  private async findBookingByCode(code: string) {
    try {
      this.logger.log(`Attempting to find booking with code: ${code}`);
      
      // First try to get from Redis (for pending bookings)
      const redisBooking = await this.bookingService.getPendingBookingFromRedis(code);
      if (redisBooking) {
        this.logger.log(`Found pending booking in Redis: ${code}`);
        return redisBooking;
      }

      // If not in Redis, look in the database
      const dbBooking = await this.bookingService.findOne({ code });
      if (dbBooking) {
        this.logger.log(`Found confirmed booking in database: ${code}`);
        return dbBooking;
      }

      this.logger.warn(`No booking found with code: ${code}`);
      return null;

    } catch (error) {
      const safeErrorDetails = {
        message: error.message || 'Unknown error',
        code: code || 'unknown',
      };
      
      if (process.env.NODE_ENV !== 'production' && error.stack) {
        safeErrorDetails['stack'] = error.stack;
      }
      
      this.logger.error(`Error in findBookingByCode: ${JSON.stringify(safeErrorDetails, null, 2)}`);
      throw new InternalServerErrorException('Error finding booking');
    }
  }

  async checkOwnership(userId: string, resourceId: string, request?: Request): Promise<boolean> {
    try {
      if (!request) {
        this.logger.error('Request object is undefined');
        throw new BadRequestException('Invalid request');
      }

      if (!resourceId) {
        this.logger.error('Resource ID is undefined. Cannot check ownership.');
        throw new BadRequestException('Invalid booking identifier');
      }

      if (!userId) {
        this.logger.error('User ID is undefined. Cannot check ownership.');
        throw new UnauthorizedException('User authentication required');
      }

      const isCode = BookingOwnerGuard.isRouteWithCode(request);
        // Add debug logging for route detection
      this.logger.debug(`Request path: ${request.path}`);
      this.logger.debug('Request params: ' + JSON.stringify(request.params, null, 2));
      this.logger.debug(`Is code route: ${isCode}`);
      
      this.logger.log(`Looking up booking by ${isCode ? 'code' : 'ID'}: ${resourceId}`);

      let booking;
      try {
        if (isCode) {
          // For code routes, we need to look in both Redis and database
          booking = await this.findBookingByCode(resourceId);
          if (!booking) {
            this.logger.warn(`Booking not found with code: ${resourceId} in either Redis or database`);
            throw new NotFoundException('Booking not found');
          }
        } else {
          booking = await this.bookingService.findOne({ id: resourceId });
          if (!booking) {
            this.logger.warn(`Booking not found with ID: ${resourceId}`);
            throw new NotFoundException('Booking not found');
          }
        }      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        }
        const fetchErrorDetails = {
          message: error.message || 'Unknown error',
          resourceId,
          isCode
        };
        this.logger.error(`Error fetching booking: ${JSON.stringify(fetchErrorDetails, null, 2)}`);
        throw new InternalServerErrorException('Error retrieving booking details');
      }

      // At this point we have a booking, check ownership
      const bookingUserId = booking.userId || booking.user?.id;
      if (!bookingUserId) {
        this.logger.error(`No user ID found in booking ${resourceId}`);
        throw new InternalServerErrorException('Invalid booking data');
      }

      if (bookingUserId !== userId) {
        this.logger.warn(`User ${userId} attempted to access booking owned by ${bookingUserId}`);
        return false;
      }

      this.logger.log(`Access granted to booking ${resourceId} for user ${userId}`);
      return true;

    } catch (error) {
      // Format error details for safe logging
      const safeErrorDetails = {
        message: error.message || 'Unknown error',
        userId: userId || 'unknown',
        resourceId: resourceId || 'unknown',
        path: request?.path || 'unknown'
      };

      if (process.env.NODE_ENV !== 'production' && error.stack) {
        safeErrorDetails['stack'] = error.stack;
      }
      
      this.logger.error(`Error in checkOwnership: ${JSON.stringify(safeErrorDetails, null, 2)}`);

      // Rethrow NestJS exceptions
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Error checking booking ownership');
    }
  }
}
