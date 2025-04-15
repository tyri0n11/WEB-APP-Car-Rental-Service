import { Booking, BookingStatus, PaymentProvider } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class BookingResponseDTO implements Booking {
  constructor(partial: Partial<BookingResponseDTO>) {
    Object.assign(this, partial);
  }
  @Expose()
  id: string;
  @Expose()
  userId: string;
  @Expose()
  carId: string;
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
  status: BookingStatus;
  @Exclude()
  transactionId: string;
  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date;
}

export class BookingResponseOnRedisDTO {
  @Expose()
  carId: string;

  @Expose()
  userId: string;

  @Expose()
  startDate: Date;

  @Expose()
  endDate: Date;

  @Expose()
  pickupAddress: string;

  @Expose()
  returnAddress: string;

  @Expose()
  paymentProvider: PaymentProvider;

  @Expose()
  bookingCode: string;

  @Expose()
  status: BookingStatus;

  @Expose()
  totalPrice: number;

  @Expose()
  returnUrl: string;
}
