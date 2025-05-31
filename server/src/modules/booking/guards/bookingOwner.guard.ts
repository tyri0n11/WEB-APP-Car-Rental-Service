import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { Request } from 'express';
import { ResourceOwnerGuard } from '@/guards/base/resourceOwner.guard';
import { BookingService } from '../booking.service';
import { BookingResponseDTO } from '../dtos/response.dto';

@Injectable()
export class BookingOwnerGuard extends ResourceOwnerGuard {
  constructor(private readonly bookingService: BookingService) {
    super();
  }

  async checkOwnership(userId: string, resourceId: string): Promise<boolean> {
    if (!userId) {
      throw new UnauthorizedException('User authentication required');
    }

    if (!resourceId) {
      throw new BadRequestException('Invalid booking identifier');
    }

    let booking: BookingResponseDTO;
    booking = await this.bookingService.findById(resourceId);
    if (!booking) {
      booking = await this.bookingService.findByCode(resourceId);
    }

    if (booking.userId !== userId) {
      return false;
    }

    return true;
  }
}
