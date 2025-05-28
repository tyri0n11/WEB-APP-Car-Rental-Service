import { BaseService } from '@/services/base/base.service';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { InjectQueue } from '@nestjs/bullmq';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  ActivityType,
  Booking,
  BookingStatus,
  CarStatus,
} from '@prisma/client';
import { Queue } from 'bullmq';
import * as dayjs from 'dayjs';
import Redis from 'ioredis';
import { CarService } from '../car/car.service';
import { DatabaseService } from '../database/database.service';
import { CreatePaymentData } from '../payment/interfaces/paymentGateway.interface';
import { PaymentService } from '../payment/payment.service';
import { TransactionService } from '../transaction/transaction.service';
import { CreateBookingRequestDTO } from './dtos/create.request.dto';
import { CrearteBookingResponseDTO } from './dtos/create.response.dto';
import { FindManyBookingsQueryDTO } from './dtos/findMany.request.dto';
import {
  BookingResponseDTO,
  BookingResponseOnRedisDTO,
} from './dtos/response.dto';
import { UnlockCarQueue } from './enums/queue';
import * as crypto from 'crypto';
import { ActivityService } from '../activity/activity.service';
import { ActivityTitle } from '../activity/consts/title.const';
@Injectable()
export class BookingService extends BaseService<Booking> {
  private readonly logger = new Logger(BookingService.name);
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly carService: CarService,
    private readonly paymentService: PaymentService,
    private readonly transactionService: TransactionService,
    private readonly activityService: ActivityService,
    @InjectRedis() private readonly redisService: Redis,
    @InjectQueue(UnlockCarQueue.name) private readonly unlockCarQueue: Queue,
  ) {
    super(databaseService, 'booking', BookingResponseDTO);
  }
  BOOKING_TIMEOUT = 360000; // 6 minutes - in miliseconds

  private readonly genRedisKey = {
    booking: (bookingCode: string) => `booking:${bookingCode}`,
  };

  private generateBookingCode(carId: string): string {
    const carIdPrefix = carId.replace(/-/g, '').substring(0, 8);
    const timestamp = Date.now().toString(36).padStart(14, '0');
    const randomSuffix = crypto.randomBytes(4).toString('hex');

    return `${carIdPrefix}${timestamp}${randomSuffix}`;
  }

  async createBookingOnRedis(userId: string, dto: CreateBookingRequestDTO) {
    const car = await this.carService.findOne({ id: dto.carId });

    const isAvailable = await this.checkCarAvailability(
      dto.carId,
      dto.startDate,
      dto.endDate,
    );

    if (!isAvailable) {
      throw new BadRequestException('Car is not available');
    }

    const totalPrice = await this.calculateTotalPrice(
      car.dailyPrice,
      dto.startDate,
      dto.endDate,
    );

    const bookingCode = this.generateBookingCode(car.id);
    const bookingKey = this.genRedisKey.booking(bookingCode);

    const bookingData = {
      ...dto,
      userId,
      bookingCode,
      totalPrice,
    };

    await this.redisService
      .multi()
      .hset(bookingKey, 'data', JSON.stringify(bookingData))
      .expire(bookingKey, this.BOOKING_TIMEOUT)
      .exec();

    return { bookingCode, totalPrice };
  }

  async checkCarAvailability(
    carId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<boolean> {
    const bookingKey = this.genRedisKey.booking(carId);
    const pendingBooking = await this.redisService.hget(bookingKey, 'data');
    if (pendingBooking) {
      return false;
    }

    const existingBookings = await this.findMany({
      filter: {
        carId,
        status: {
          in: [BookingStatus.CONFIRMED, BookingStatus.ONGOING],
        },
        OR: [
          {
            startDate: { lte: endDate },
            endDate: { gte: startDate },
          },
        ],
      },
    });
    if (existingBookings.length > 0) return false;
    return true;
  }

  async calculateTotalPrice(
    dailyPrice: number,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const days = dayjs(endDate).diff(startDate, 'day');
    return dailyPrice * days;
  }

  async confirmBooking(
    userId: string,
    dto: CreateBookingRequestDTO,
    paymentData: CreatePaymentData,
  ): Promise<CrearteBookingResponseDTO> {
    const { bookingCode, totalPrice } = await this.createBookingOnRedis(
      userId,
      dto,
    );
    const bookingKey = await this.genRedisKey.booking(bookingCode);
    let paymentUrl = '';
    try {
      const result = await this.paymentService.createPaymentLink(
        dto.paymentProvider,
        {
          ip: paymentData.ip,
          host: paymentData.host,
          returnUrl: dto.returnUrl,
          orderCode: bookingCode,
          amount: Number(totalPrice),
        },
      );
      paymentUrl = result.url;
    } catch (error) {
      console.log('error: ', error);
      await this.redisService.del(bookingKey);
      throw new InternalServerErrorException('Payment failed');
    }

    const bookingDataJson = await this.redisService.hget(bookingKey, 'data');
    const bookingData: BookingResponseOnRedisDTO = JSON.parse(bookingDataJson);    await this.unlockCarQueue.add(
      UnlockCarQueue.jobName,
      { bookingCode },
      { delay: this.BOOKING_TIMEOUT },
    );
    this.logger.log(`Added ${bookingCode} to unlockCarQueue`);
    return { bookingData, paymentUrl };
  }
  async completeBooking(
    bookingCode: string,
    transactionId: string,
  ): Promise<BookingResponseDTO> {
    const bookingKey = await this.genRedisKey.booking(bookingCode);
    const bookingDataJson = await this.redisService.hget(bookingKey, 'data');
    
    // Check if booking exists in database first
    try {
      const existingBooking = await super.findOne({ code: bookingCode });
      if (existingBooking) {
        this.logger.log(`Booking ${bookingCode} already exists in database`);
        return existingBooking;
      }
    } catch (error) {
      this.logger.error(`Error checking for existing booking ${bookingCode}:`, error);
    }

    if (!bookingDataJson) {
      throw new BadRequestException('Booking not found or expired');
    }
    
    // Parse booking data from Redis
    let bookingData: BookingResponseOnRedisDTO;
    try {
      bookingData = JSON.parse(bookingDataJson);
    } catch (error) {
      this.logger.error(`Error parsing booking data from Redis for ${bookingCode}:`, error);
      throw new InternalServerErrorException('Invalid booking data format');
    }

    // Execute database transaction with retries
    let retryCount = 0;
    const maxRetries = 3;
    let finalBooking: BookingResponseDTO | null = null;
    
    while (retryCount < maxRetries) {
      try {
        const createdBooking = await this.databaseService.$transaction(async (tx) => {
          // First check if booking already exists to handle race conditions
          const existingBooking = await tx.booking.findUnique({
            where: { code: bookingCode },
          });
          
          if (existingBooking) {
            this.logger.log(`Booking ${bookingCode} already exists in database`);
            return existingBooking;
          }

          // Update car status
          await tx.car.update({
            where: { id: bookingData.carId },
            data: { status: CarStatus.RENTED },
          });

          // Create booking
          return await tx.booking.create({
            data: {
              code: bookingData.bookingCode,
              startDate: bookingData.startDate,
              endDate: bookingData.endDate,
              totalPrice: bookingData.totalPrice,
              pickupAddress: bookingData.pickupAddress,
              returnAddress: bookingData.returnAddress,
              status: BookingStatus.CONFIRMED,
              user: {
                connect: { id: bookingData.userId },
              },
              car: {
                connect: { id: bookingData.carId },
              },
              transaction: {
                connect: { id: transactionId },
              },
            },
          });
        });

        // Only delete from Redis if transaction was successful
        await this.redisService.del(bookingKey);
        this.logger.log(`Successfully completed booking ${bookingCode}`);
        finalBooking = createdBooking;

        // Create activity after booking is confirmed
        await this.activityService.create({
          bookingId: createdBooking.id,
          carId: bookingData.carId,
          amount: bookingData.totalPrice,
          type: ActivityType.BOOKING_CREATED,
          title: ActivityTitle.BOOKING_CREATED,
        });

        break;

      } catch (error) {
        retryCount++;
        if (retryCount === maxRetries) {
          this.logger.error(`Failed to complete booking ${bookingCode} after ${maxRetries} attempts:`, error);
          throw new InternalServerErrorException('Failed to complete booking');
        }
        this.logger.warn(`Retrying booking completion for ${bookingCode}, attempt ${retryCount}`);
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)); // Exponential backoff
      }
    }

    if (!finalBooking) {
      throw new InternalServerErrorException('Failed to complete booking');
    }
    return finalBooking;
  }

  async processTransaction(bookingCode: string) {
    const bookingKey = await this.genRedisKey.booking(bookingCode);
    bookingKey;
    const bookingDataJson = await this.redisService.hget(bookingKey, 'data');

    if (!bookingDataJson) {
      throw new BadRequestException('Booking not found or completed');
    }
    const bookingData: BookingResponseOnRedisDTO = JSON.parse(bookingDataJson);

    const transactionData = {
      amount: bookingData.totalPrice,
      discount: 0,
      paymentProvider: bookingData.paymentProvider,
    };
    const createdTransation =
      await this.transactionService.create(transactionData);
    await this.completeBooking(bookingCode, createdTransation.id);
  }

  async findManyByUserId(userId: string): Promise<BookingResponseDTO[]> {
    return await super.findMany({
      filter: {
        userId,
      },
    });
  }

  async findManyWithPagination(query: FindManyBookingsQueryDTO) {
    const { page, perPage, startDate, endDate, status } = query;

    const filter: any = {};
    if (startDate && endDate) {
      filter.startDate = {
        gte: startDate,
      };
      filter.endDate = {
        lte: endDate,
      };
    }
    if (status) {
      filter.status = {
        equals: status,
      };
    }

    return await super.findManyWithPagination({
      filter,
      orderBy: {
        createdAt: 'desc',
      },
      page,
      perPage,
    });
  }
  async findById(id: string): Promise<BookingResponseDTO> {
    const foundBooking = await super.findOne({ id });
    if (!foundBooking) {
      throw new NotFoundException('Booking not found');
    }
    return foundBooking;
  }

  async handleReturnCar(id: string): Promise<BookingResponseDTO> {
    const updatedBooking = await this.databaseService.$transaction(
      async (tx) => {
        const booking = await tx.booking.findUnique({
          where: { id },
          include: { car: true },
        });

        if (!booking) {
          throw new BadRequestException('Booking not found');
        }

        if (booking.status !== BookingStatus.ONGOING) {
          throw new BadRequestException('Booking is not ongoing');
        }

        const updatedBooking = await tx.booking.update({
          where: { id },
          data: {
            status: BookingStatus.COMPLETED,
            updatedAt: new Date(),
          },
        });

        await tx.car.update({
          where: { id: booking.carId },
          data: {
            status: CarStatus.AVAILABLE,
          },
        });

        return updatedBooking;
      },
    );

    await this.activityService.create({
      bookingId: updatedBooking.id,
      carId: updatedBooking.carId,
      type: ActivityType.BOOKING_COMPLETED,
      title: ActivityTitle.BOOKING_COMPLETED,
      description: `Car returned for booking ${updatedBooking.id}`
    });

    return updatedBooking;
  }

  async updateStatus(
    id: string,
    status: BookingStatus,
  ): Promise<BookingResponseDTO> {
    const foundBooking = await super.findOne({ id });
    if (foundBooking) {
      throw new NotFoundException('Booking not found');
    }

    return await super.update({ id }, { status });
  }

  async unlockCar(bookingCode: string) {
    const bookingKey = await this.genRedisKey.booking(bookingCode);

    const bookingDataJson = await this.redisService.hget(bookingKey, 'data');
    if (!bookingDataJson) {
      throw new BadRequestException('Booking not found or completed');
    }
    await this.redisService.del(bookingKey);
  }  async findByCode(bookingCode: string): Promise<BookingResponseDTO> {
    try {
      this.logger.log(`Searching for booking with code: ${bookingCode}`);

      // Try database first since most bookings will be there
      try {
        const dbBooking = await super.findOne({ code: bookingCode });
        if (dbBooking) {
          this.logger.log(`Found booking with code ${bookingCode} in database`);
          return dbBooking;
        }
      } catch (error) {
        if (!(error instanceof NotFoundException)) {
          throw error;
        }
      }
      
      // If not in database, check Redis for pending bookings
      this.logger.log(`Checking Redis for pending booking with code: ${bookingCode}`);
      const pendingBooking = await this.getPendingBookingFromRedis(bookingCode);
      
      if (!pendingBooking) {
        this.logger.warn(`Booking with code ${bookingCode} not found in either database or Redis`);
        throw new NotFoundException('Booking not found');
      }
      
      this.logger.log(`Found pending booking with code ${bookingCode} in Redis`);
      return pendingBooking;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error finding booking with code ${bookingCode}:`, error);
      throw new InternalServerErrorException('Error retrieving booking details');
    }
  }

  async getPendingBookingFromRedis(bookingCode: string) {
    try {
      const bookingKey = this.genRedisKey.booking(bookingCode);
      const bookingDataJson = await this.redisService.hget(bookingKey, 'data');
      if (bookingDataJson) {
        return JSON.parse(bookingDataJson);
      }
      return null;
    } catch (error) {
      console.error('Error getting pending booking from Redis:', error);
      return null;
    }
  }
}
