import { ApiProperty } from '@nestjs/swagger';
import { Booking, BookingStatus, PaymentProvider } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class BookingResponseDTO implements Booking {
  constructor(partial: Partial<BookingResponseDTO>) {
    Object.assign(this, partial);
  }
  @Expose()
  id: string;
  @Expose()
  code: string;
  @Expose()
  userId: string;
  @Expose()
  carId: string;
  @Expose()
  carImageUrl: string;
  @Expose()
  startDate: Date;
  @Expose()
  endDate: Date;
  @Expose()
  pickupAddress: string;
  @Expose()
  returnAddress: string;
  @Expose()
  totalPrice: number;
  @Expose()
  @ApiProperty({
    enum: BookingStatus,
    example: BookingStatus.CONFIRMED,
  })
  status: BookingStatus;
  @Exclude()
  transactionId: string;
  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date;
}

export class BookingResponseOnRedisDTO {
  carId: string;
  carImageUrl: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  pickupAddress: string;
  returnAddress: string;
  paymentProvider: PaymentProvider;
  bookingCode: string;
  status: BookingStatus;
  totalPrice: number;
  returnUrl: string;
}
