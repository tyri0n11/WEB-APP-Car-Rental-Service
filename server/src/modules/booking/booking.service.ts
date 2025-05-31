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
import {
  FindManyBookingsQueryDTO,
  ListBookingRequestDTO,
} from './dtos/findMany.request.dto';
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
    const bookingData: BookingResponseOnRedisDTO = JSON.parse(bookingDataJson);

    await this.unlockCarQueue.add(
      UnlockCarQueue.jobName,
      { bookingCode },
      { delay: this.BOOKING_TIMEOUT },
    );
    this.logger.log(`Added ${bookingCode} to unlockCarQueue`);

    this.activityService.create({
      bookingCode: bookingData.bookingCode,
      carId: bookingData.carId,
      amount: bookingData.totalPrice,
      type: ActivityType.BOOKING,
      description: `Customer ${bookingData.userId} booked ${bookingData.carId}`,
      title: ActivityTitle.BOOKING,
    });
    return { bookingData, paymentUrl };
  }

  async completeBooking(
    bookingCode: string,
    transactionId: string,
  ): Promise<BookingResponseDTO> {
    const bookingKey = await this.genRedisKey.booking(bookingCode);
    const bookingDataJson = await this.redisService.hget(bookingKey, 'data');
    if (!bookingDataJson) {
      throw new BadRequestException('Booking not found or completed');
    }
    const bookingData: BookingResponseOnRedisDTO = JSON.parse(bookingDataJson);
    this.activityService.create({
      bookingCode: bookingData.bookingCode,
      carId: bookingData.carId,
      amount: bookingData.totalPrice,
      type: ActivityType.PAYMENT,
      title: ActivityTitle.PAYMENT,
      description: `Customer ${bookingData.userId} paid for ${bookingData.carId}`,
    });
    const createdBooking = await this.databaseService.$transaction(
      async (tx) => {
        await tx.car.update({
          where: {
            id: bookingData.carId,
          },
          data: {
            status: CarStatus.RENTED,
          },
        });

        return await tx.booking.create({
          data: {
            code: bookingData.bookingCode,
            startDate: bookingData.startDate,
            endDate: bookingData.endDate,
            totalPrice: bookingData.totalPrice,
            pickupAddress: bookingData.pickupAddress,
            returnAddress: bookingData.returnAddress,
            status: BookingStatus.ONGOING,
            user: {
              connect: {
                id: bookingData.userId,
              },
            },
            car: {
              connect: {
                id: bookingData.carId,
              },
            },
            transaction: {
              connect: {
                id: transactionId,
              },
            },
          },
        });
      },
    );

    await this.redisService.del(bookingKey);

    return createdBooking;
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

  async listBooking(dto: ListBookingRequestDTO): Promise<BookingResponseDTO[]> {
    const { userId, status, startDate, endDate } = dto;

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
    if (userId) {
      filter.userId = {
        equals: userId,
      };
    }
    return await super.findMany({
      filter,
    });
  }

  async findManyWithPagination(query: FindManyBookingsQueryDTO) {
    const { page, perPage, startDate, endDate, status, carId, userId } = query;

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

    if (carId) {
      filter.carId = {
        equals: carId,
      };
    }

    if (userId) {
      filter.userId = {
        equals: userId,
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
    if (foundBooking) {
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

        if (
          booking.status !== BookingStatus.ONGOING &&
          booking.status !== BookingStatus.CONFIRMED
        ) {
          throw new BadRequestException('Booking is not ongoing or confirmed');
        }

        const updatedBooking = await tx.booking.update({
          where: { id },
          data: {
            status: BookingStatus.RETURNED,
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

    this.activityService.create({
      bookingCode: updatedBooking.code,
      carId: updatedBooking.carId,
      type: ActivityType.RETURN,
      title: ActivityTitle.RETURN,
      description: `Car ${updatedBooking.carId} returned`,
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
  }

  async findByCode(bookingCode: string): Promise<BookingResponseDTO> {
    return await super.findOne({ code: bookingCode });
  }
}
