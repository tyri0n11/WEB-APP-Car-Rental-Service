import { BaseService } from '@/services/base/base.service';
import { InjectRedis } from '@nestjs-modules/ioredis';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Booking, BookingStatus, CarStatus } from '@prisma/client';
import * as crypto from 'crypto';
import * as dayjs from 'dayjs';
import Redis from 'ioredis';
import { CarService } from '../car/car.service';
import { DatabaseService } from '../database/database.service';
import { CreatePaymentData } from '../payment/interfaces/paymentGateway.interface';
import { PaymentService } from '../payment/payment.service';
import { CreateTransactionRequestDTO } from '../transaction/dto/create.request.dto';
import { TransactionService } from '../transaction/transaction.service';
import { CreateBookingRequestDTO } from './dto/create.request.dto';
import { CrearteBookingResponseDTO } from './dto/create.response.dto';
import {
  BookingResponseDTO,
  BookingResponseOnRedisDTO,
} from './dto/response.dto';
import { FindManyBookingsQueryDTO } from './dto/findMany.request.dto';
@Injectable()
export class BookingService extends BaseService<Booking> {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly carService: CarService,
    private readonly paymentService: PaymentService,
    private readonly transactionService: TransactionService,

    @InjectRedis() private readonly redisService: Redis,
  ) {
    super(databaseService, 'booking', BookingResponseDTO);
  }
  bookingTimeout = 600; // 10 minutes
  private genBookingCode(): string {
    const now = dayjs().format('YYMMDD').toString();
    const randomNumber = crypto
      .randomInt(0, 10000000000)
      .toString()
      .padStart(10, '0');
    return now + randomNumber;
  }
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

    const bookingCode = this.genBookingCode();
    const bookingKey = this.genRedisKey.booking(bookingCode);

    const bookingData = {
      ...dto,
      userId,
      bookingCode,
      status: BookingStatus.PENDING,
      totalPrice,
    };

    await this.redisService
      .multi()
      .hset(bookingKey, 'data', JSON.stringify(bookingData))
      .expire(bookingKey, this.bookingTimeout)
      .exec();

    return { bookingCode, totalPrice };
  }

  async checkCarAvailability(
    carId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<boolean> {
    const existingBooking = await this.findMany({
      filter: {
        carId,
        status: {
          in: [BookingStatus.CONFIRMED, BookingStatus.PENDING],
        },
        OR: [
          {
            startDate: { lte: endDate },
            endDate: { gte: startDate },
          },
        ],
      },
    });

    return !existingBooking;
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
      dto.paymentGateway,
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
    return createdBooking;
  }

  async processTransaction(bookingCode: string) {
    const bookingKey = await this.genRedisKey.booking(bookingCode);
    const bookingDataJson = await this.redisService.hget(bookingKey, 'data');
    if (!bookingDataJson) {
      throw new BadRequestException('Booking not found or completed');
    }
    const bookingData: BookingResponseOnRedisDTO = JSON.parse(bookingDataJson);

    const transactionData: CreateTransactionRequestDTO = {
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
        throw new NotFoundException('Booking not found');
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
}
