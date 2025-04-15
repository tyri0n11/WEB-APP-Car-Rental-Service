import { BaseService } from '@/services/base/base.service';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { InjectQueue } from '@nestjs/bullmq';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Booking, BookingStatus, CarStatus } from '@prisma/client';
import { Queue } from 'bullmq';
import * as dayjs from 'dayjs';
import Redis from 'ioredis';
import { CarService } from '../car/car.service';
import { DatabaseService } from '../database/database.service';
import { CreatePaymentData } from '../payment/interfaces/paymentGateway.interface';
import { PaymentService } from '../payment/payment.service';
import { TransactionService } from '../transaction/transaction.service';
import { UserActionService } from '../user-action/user-action.service';
import { CreateBookingRequestDTO } from './dtos/create.request.dto';
import { CrearteBookingResponseDTO } from './dtos/create.response.dto';
import { FindManyBookingsQueryDTO } from './dtos/findMany.request.dto';
import {
  BookingResponseDTO,
  BookingResponseOnRedisDTO,
} from './dtos/response.dto';
import { UnlockCarQueue } from './enums/queue';
@Injectable()
export class BookingService extends BaseService<Booking> {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly carService: CarService,
    private readonly paymentService: PaymentService,
    private readonly transactionService: TransactionService,
    private readonly userActionService: UserActionService,
    @InjectRedis() private readonly redisService: Redis,
    @InjectQueue(UnlockCarQueue.name) private readonly unlockCarQueue: Queue,
  ) {
    super(databaseService, 'booking', BookingResponseDTO);
  }
  BOOKING_TIMEOUT = 360000; // 6 minutes - in miliseconds

  private readonly genRedisKey = {
    booking: (bookingCode: string) => `booking:${bookingCode}`,
  };
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

    const bookingCode = car.id;
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

    const paymentUrl = result.url;

    const bookingKey = await this.genRedisKey.booking(bookingCode);
    const bookingDataJson = await this.redisService.hget(bookingKey, 'data');

    const bookingData: BookingResponseOnRedisDTO = JSON.parse(bookingDataJson);

    await this.unlockCarQueue.add(
      UnlockCarQueue.jobName,
      { bookingCode },
      { delay: this.BOOKING_TIMEOUT },
    );
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
            startDate: bookingData.startDate,
            endDate: bookingData.endDate,
            totalPrice: bookingData.totalPrice,
            pickupAddress: bookingData.pickupAddress,
            returnAddress: bookingData.returnAddress,
            status: BookingStatus.CONFIRMED,
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

    await this.userActionService.trackBooking({
      userId: bookingData.userId,
      carId: bookingData.carId,
      metadata: {
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
      },
    });

    if (createdBooking) await this.redisService.del(bookingKey);
    return createdBooking;
  }

  async processTransaction(bookingCode: string) {
    const bookingKey = await this.genRedisKey.booking(bookingCode);
    console.log(bookingKey);
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
    console.log(createdTransation);
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
    if (foundBooking) {
      throw new NotFoundException('Booking not found');
    }
    return foundBooking;
  }

  async handleReturnCar(id: string): Promise<BookingResponseDTO> {
    return await this.databaseService.$transaction(async (tx) => {
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
    });
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
}
