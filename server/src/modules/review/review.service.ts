import { BaseService } from '@/services/base/base.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Review } from '@prisma/client';
import { BookingService } from '../booking/booking.service';
import { DatabaseService } from '../database/database.service';
import { CreateReviewRequestDTO } from './dto/create.request.dto';
import { ReviewResponseDTO } from './dto/response.dto';
import { FindManyByCarIdQueryDTO } from './dto/findManyByCarId.request.dto';

@Injectable()
export class ReviewService extends BaseService<Review> {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly bookingService: BookingService,
  ) {
    super(databaseService, 'review', ReviewResponseDTO);
  }
  async createWithUserData(
    userId: string,
    firstName: string,
    lastName: string,
    dto: CreateReviewRequestDTO,
  ) {
    const { bookingId, comment, rating } = dto;
    const foundBooking = await this.bookingService.findOne({
      id: bookingId,
      userId: userId,
    });
    if (!foundBooking) {
      throw new NotFoundException('Booking not found');
    }
    console.log(foundBooking);
    const userName = firstName + ' ' + lastName;
    return await super.create({
      comment,
      rating,
      userName,
      car: {
        connect: {
          id: foundBooking.carId,
        },
      },
      booking: {
        connect: {
          id: bookingId,
        },
      },
    });
  }

  findManyByCarId(query: FindManyByCarIdQueryDTO) {
    const { carId, page, perPage } = query;
    const filter = { carId };
    return super.findManyWithPagination({
      filter,
      page,
      perPage,
      orderBy: {
        rating: 'desc',
      },
    });
  }

  async findById(id: string) {
    const foundReview = await super.findOne({ id });
    if (!foundReview) {
      throw new NotFoundException('Review not found');
    }
    return foundReview;
  }

  async remove(id: string) {
    const foundReview = await super.findOne({ id });
    if (!foundReview) {
      throw new NotFoundException('Review not found');
    }

    await super.remove({ id });
  }
}
