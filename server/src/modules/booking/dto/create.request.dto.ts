import { PaymentProvider } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateBookingRequestDTO {
  @IsNotEmpty()
  @IsString()
  carId: string;

  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @IsDate()
  @IsNotEmpty()
  endDate: Date;

  @IsString()
  pickupAddress: string;

  @IsString()
  @IsNotEmpty()
  returnAddress: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.toUpperCase())
  paymentProvider: PaymentProvider;

  @IsString()
  @IsNotEmpty()
  returnUrl: string;
}
