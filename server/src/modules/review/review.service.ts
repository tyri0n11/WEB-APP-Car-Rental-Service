import { BaseService } from '@/services/base/base.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Review } from '@prisma/client';
import { BookingService } from '../booking/booking.service';
import { DatabaseService } from '../database/database.service';
import { CreateReviewRequestDTO } from './dtos/create.request.dto';
import { ReviewResponseDTO } from './dtos/response.dto';
import { FindManyByCarIdQueryDTO } from './dtos/findManyByCarId.request.dto';
import { CarService } from '../car/car.service';

@Injectable()
export class ReviewService extends BaseService<Review> {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly bookingService: BookingService,
    private readonly carService: CarService,
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
      throw new BadRequestException('Booking not found');
    }

    console.log(foundBooking);
    const userName = firstName + ' ' + lastName;
    const review = await super.create({
      comment,
      rating,
      userName,
      userId,
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

    const car = await this.carService.findOne({ id: foundBooking.carId });
    car.rating = (car.rating + rating) / 2;
    await this.carService.update(car.id, { rating: car.rating });
    return review;
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
